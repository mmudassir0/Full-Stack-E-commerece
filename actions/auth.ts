"use server";

import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import { AuthError } from "next-auth";
import {
  SignUpSchema,
  SignUpFormValues,
  SignInFormValues,
  SignInSchema,
} from "@/prisma/schemas";
import { headers } from "next/headers";
import { getSession } from "next-auth/react";
import { getClientIp } from "@/lib/getClientIp";
import { AUTH_CONSTANTS } from "@/lib/constants";

interface AuthResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  redirectTo?: string;
  userId?: string;
  requiresTwoFactor?: boolean;
}

const ActivityActions = {
  USER_REGISTER: "USER_REGISTER",
  USER_LOGIN: "USER_LOGIN",
  USER_LOGOUT: "USER_LOGOUT",
};
function extractHeaders() {
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "Unknown";
  const ipAddress = getClientIp(headersList);
  return { userAgent, ipAddress };
}

async function logActivity(
  userId: string,
  action: keyof typeof ActivityActions,
  details?: Record<string, string>
) {
  const { userAgent, ipAddress } = extractHeaders();
  await db.activityLog.create({
    data: {
      userId,
      action,
      ipAddress,
      deviceDetails: userAgent,
      actionDetails: details ? details : undefined,
    },
  });
}
function generateVerificationToken(length = 32): string {
  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);
  const token = Array.from(randomBytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return token;
}

async function createPasswordHash(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

function handleAuthError(error: AuthError) {
  switch (error.type) {
    case "CredentialsSignin":
      return {
        success: false,
        message: "Invalid credentials",
        errors: {
          email: ["Incorrect email or password"],
        },
      };
    default:
      return {
        message: "Something went wrong",
        errors: {},
        success: false,
      };
  }
}
export async function registerUser(formData: SignUpFormValues) {
  try {
    const validatedFields = SignUpSchema.safeParse(formData);
    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name, email, password, termsAccepted } = validatedFields.data;

    const existingUser = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Email already registered",
        errors: { email: ["This email is already registered"] },
      };
    }
    const verificationToken = generateVerificationToken();
    const hashedPassword = await createPasswordHash(password);

    const result = await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          termsAccepted,
          verificationToken,
          verificationExpires: new Date(
            Date.now() + AUTH_CONSTANTS.VERIFICATION_TOKEN_EXPIRY
          ),
          profile: {
            create: {
              name,
            },
          },
          PasswordHistory: {
            create: {
              password: hashedPassword,
            },
          },
        },
        include: {
          profile: true,
        },
      });
      // await sendVerificationEmail(newUser.email, newUser.verificationToken);

      await tx.activityLog.create({
        data: {
          userId: newUser.id,
          action: "USER_REGISTER",
          ipAddress: extractHeaders().ipAddress,
          deviceDetails: extractHeaders().userAgent,
          actionDetails: {
            registrationMethod: "email",
            hasVerificationEmail: true,
          },
        },
      });
      return newUser;
    });

    // await loginUser({
    //   email: formData.email!,
    //   password: formData.password,
    // });
    return {
      success: true,
      message: "Registration successful. Please verify your email.",
      redirectTo: "/signin",
      userId: result.id,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "An unexpected error occurred during registration",
      errors: {},
    };
  }
}

export async function loginUser(formData: SignInFormValues) {
  try {
    const validatedFields = SignInSchema.safeParse(formData);
    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
    const { email, password, rememberMe } = validatedFields.data;

    const user = await db.user.findUnique({
      where: {
        email,
        status: "ACTIVE",
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        password: true,
        status: true,
        failedLoginAttempts: true,
        lockedUntil: true,
        isVerified: true,
        twoFactorEnabled: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }
    //  Check account lock status
    const isLocked = user.lockedUntil && user.lockedUntil > new Date();
    if (user.failedLoginAttempts >= 5 && isLocked) {
      const timeRemaining = Math.ceil(
        (user.lockedUntil!.getTime() - Date.now()) / 1000 / 60
      );
      return {
        success: false,
        message: "Account temporarily locked",
        errors: {
          email: [
            `Account locked. Please try again in ${timeRemaining} minutes`,
          ],
        },
      };
    }
    if (!user.password) {
      await handleFailedLogin(user.id);
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    if (user.status === "BLOCKED") {
      return {
        message: "Account blocked",
        errors: {
          email: ["Account has been blocked. Please contact support."],
        },
      };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      await handleFailedLogin(user.id);
      return {
        success: false,
        message: "Invalid credentials",
      };
    }
    await handleSuccessfulLogin(user.id);

    // Create session
    const result = await signIn("credentials", {
      email,
      password,
      rememberMe,
      redirect: false,
      callbackUrl: "/",
    });

    if (result?.error) {
      throw new AuthError("CredentialsSignin");
    }
    if (user.twoFactorEnabled) {
      return {
        success: true,
        requiresTwoFactor: true,
        userId: user.id,
      };
    }
    return {
      success: true,
      message: "Login successful",
      redirectTo: "/dashboard",
    };
  } catch (error) {
    if (error instanceof AuthError) return handleAuthError(error);
    throw error;
  }
}

async function handleFailedLogin(userId: string) {
  await db.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { failedLoginAttempts: true },
    });

    const newAttempts = (user?.failedLoginAttempts || 0) + 1;
    const shouldLock = newAttempts >= AUTH_CONSTANTS.MAX_LOGIN_ATTEMPTS;

    await tx.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: newAttempts,
        lockedUntil: shouldLock
          ? new Date(Date.now() + AUTH_CONSTANTS.ACCOUNT_LOCKOUT_DURATION)
          : null,
      },
    });

    await tx.activityLog.create({
      data: {
        userId,
        action: "USER_LOGIN",
        actionDetails: {
          status: "failed",
          attemptNumber: newAttempts,
          locked: shouldLock,
        },
        ipAddress: getClientIp(headers()),
        deviceDetails: headers().get("user-agent") || "Unknown",
      },
    });
  });
}

async function handleSuccessfulLogin(userId: string) {
  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });

    await tx.activityLog.create({
      data: {
        userId,
        action: "USER_LOGIN",
        actionDetails: { status: "success" },
        ipAddress: getClientIp(headers()),
        deviceDetails: headers().get("user-agent") || "Unknown",
      },
    });
  });
}
async function isPasswordReused(
  userId: string,
  newPassword: string
): Promise<boolean> {
  const recentPasswords = await db.passwordHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: AUTH_CONSTANTS.PASSWORD_HISTORY_LIMIT,
  });

  for (const record of recentPasswords) {
    if (await bcrypt.compare(newPassword, record.password)) {
      return true;
    }
  }
  return false;
}

export async function updatePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<AuthResult> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        password: true,
        lastPasswordChange: true,
      },
    });

    if (!user?.password) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      return {
        success: false,
        message: "Current password is incorrect",
      };
    }

    // Check minimum password age
    const passwordAge = Date.now() - user.lastPasswordChange.getTime();
    if (passwordAge < AUTH_CONSTANTS.MIN_PASSWORD_AGE) {
      return {
        success: false,
        message: "Password was changed too recently. Please try again later.",
      };
    }

    // Check password history
    if (await isPasswordReused(userId, newPassword)) {
      return {
        success: false,
        message: `Cannot reuse any of your last ${AUTH_CONSTANTS.PASSWORD_HISTORY_LIMIT} passwords`,
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await db.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
          lastPasswordChange: new Date(),
        },
      });

      await tx.passwordHistory.create({
        data: {
          userId,
          password: hashedPassword,
        },
      });

      // Clean up old password history
      const oldPasswords = await tx.passwordHistory.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip: AUTH_CONSTANTS.PASSWORD_HISTORY_LIMIT,
        select: { id: true },
      });

      if (oldPasswords.length > 0) {
        await tx.passwordHistory.deleteMany({
          where: {
            id: {
              in: oldPasswords.map((p) => p.id),
            },
          },
        });
      }
    });

    return {
      success: true,
      message: "Password updated successfully",
    };
  } catch (error) {
    console.error("Password update error:", error);
    return {
      success: false,
      message: "An unexpected error occurred while updating password",
    };
  }
}

export async function logout() {
  try {
    const session = await getSession();
    const userId = session?.user?.id;

    if (userId) {
      await logActivity(userId, ActivityActions.USER_LOGOUT as "USER_LOGOUT");
    }

    await signOut({ redirectTo: "/signin" });
  } catch (error) {
    console.error("Error during logout:", error);
    await signOut({ redirectTo: "/signin" });
  }
}

// --------------------------------profile----------------------------------

// export async function updateProfile(
//   userId: string,
//   data: UpdateProfileFormValues
// ) {
//   const validated = UpdateProfileSchema.safeParse(data);
//   if (!validated.success) return formatValidationErrors(validated.error);

//   const profile = await db.profile.upsert({
//     where: { userId },
//     create: { userId, ...validated.data },
//     update: validated.data,
//   });

//   return { success: true, profile };
// }

// --------------------------------update password------------------------------
// export async function updatePassword(userId: string, newPassword: string) {
//   const hashedPassword = await bcrypt.hash(newPassword, 12);

//   // Check password history
//   const recentPasswords = await db.passwordHistory.findMany({
//     where: { userId },
//     orderBy: { createdAt: "desc" },
//     take: 3,
//   });

//   for (const old of recentPasswords) {
//     if (await bcrypt.compare(newPassword, old.password)) {
//       throw new Error("Cannot reuse recent passwords");
//     }
//   }

//   await db.user.update({
//     where: { id: userId },
//     data: {
//       password: hashedPassword,
//       lastPasswordChange: new Date(),
//     },
//   });

//   await db.passwordHistory.create({
//     data: {
//       userId,
//       password: hashedPassword,
//     },
//   });
// }
