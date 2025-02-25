// Server actions file: app/actions/2fa.ts
"use server";

import { db } from "@/lib/db";

import {
  generateTwoFactorCode,
  generateTwoFactorExpiry,
  // sendTwoFactorEmail,
  verifyTwoFactorCode,
  saveTwoFactorCode,
  clearTwoFactorCode,
} from "@/utils/2fa";

export async function generateAndSend2FACode(email: string) {
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Generate 2FA code and expiry time
  const code = generateTwoFactorCode();
  const expiresAt = generateTwoFactorExpiry();

  // Save the code to the user's record
  await saveTwoFactorCode(user.id, code, expiresAt);

  // Send the code via email
  const subject = "Your 2FA Code";
  const text = `Your 2FA code is: ${code}`;
  // await sendEmail(email, subject, text);

  return { success: true };
}
// ------------------------------------
export async function verify2FACode(userId: string, code: string) {
  const isValid = await verifyTwoFactorCode(userId, code);

  if (isValid) {
    // Clear the 2FA code after successful verification
    await clearTwoFactorCode(userId);
  }

  return { isValid };
}

// ---------------------------------------------------------------------------------

// Enable 2FA for a user
export async function enableTwoFactor(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isVerified) {
      throw new Error("User not found or not verified");
    }

    const twoFactorCode = generateTwoFactorCode();
    const twoFactorExpiry = generateTwoFactorExpiry();

    await db.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: twoFactorCode,
        verificationExpires: twoFactorExpiry,
      },
    });

    // await sendTwoFactorEmail(user.email, twoFactorCode);

    return { success: true };
  } catch (error) {
    console.error("Enable 2FA error:", error);
    return { success: false, error: "Failed to enable 2FA" };
  }
}

// Verify and complete 2FA setup
export async function verifyAndEnableTwoFactor(userId: string, code: string) {
  try {
    const isValid = await verifyTwoFactorCode(userId, code);

    if (!isValid) {
      throw new Error("Invalid or expired verification code");
    }

    await db.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: null, // Clear the temporary secret
        verificationExpires: null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Verify 2FA error:", error);
    return { success: false, error: "Failed to verify 2FA code" };
  }
}

// Generate and send 2FA code for login
export async function generateLoginTwoFactorCode(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.twoFactorEnabled) {
      throw new Error("User not found or 2FA not enabled");
    }

    const twoFactorCode = generateTwoFactorCode();
    const twoFactorExpiry = generateTwoFactorExpiry();

    await db.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: twoFactorCode,
        verificationExpires: twoFactorExpiry,
      },
    });

    // await sendTwoFactorEmail(user.email, twoFactorCode);

    return { success: true };
  } catch (error) {
    console.error("Generate login 2FA code error:", error);
    return { success: false, error: "Failed to generate 2FA code" };
  }
}

// Verify 2FA code during login
export async function verifyLoginTwoFactor(userId: string, code: string) {
  try {
    const isValid = await verifyTwoFactorCode(userId, code);

    if (!isValid) {
      await db.user.update({
        where: { id: userId },
        data: {
          failedLoginAttempts: {
            increment: 1,
          },
        },
      });
      throw new Error("Invalid verification code");
    }

    await db.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: null,
        verificationExpires: null,
        failedLoginAttempts: 0,
        lastLoginAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Verify login 2FA error:", error);
    return { success: false, error: "Failed to verify 2FA code" };
  }
}

// Disable 2FA
export async function disableTwoFactor(userId: string) {
  try {
    await db.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Disable 2FA error:", error);
    return { success: false, error: "Failed to disable 2FA" };
  }
}

// // app/actions/twoFactor.ts

// import { db } from "@/lib/db";
// import { AuthError } from "next-auth";
// import { signIn } from "next-auth/react";

// export async function verifyTwoFactorCode(userId: string, code: string) {
//   try {
//     const user = await db.user.findUnique({
//       where: {
//         id: userId,
//         status: "ACTIVE",
//         deletedAt: null,
//       },
//       select: {
//         id: true,
//         email: true,
//         verificationToken: true,
//         verificationExpires: true,
//       },
//     });

//     if (!user || !user.verificationToken) {
//       return {
//         success: false,
//         message: "Invalid verification attempt",
//       };
//     }

//     if (new Date() > user.verificationExpires!) {
//       return {
//         success: false,
//         message: "Verification code has expired",
//       };
//     }

//     if (user.verificationToken !== code) {
//       return {
//         success: false,
//         message: "Invalid verification code",
//       };
//     }

//     // Clear verification token
//     await db.user.update({
//       where: { id: user.id },
//       data: {
//         verificationToken: null,
//         verificationExpires: null,
//         lastLoginAt: new Date(),
//       },
//     });

//     // Create session
//     const result = await signIn("credentials", {
//       email: user.email,
//       twoFactorVerified: true, // Add this to your credentials auth config
//       redirect: false,
//       callbackUrl: "/",
//     });

//     if (result?.error) {
//       throw new AuthError("CredentialsSignin");
//     }

//     return {
//       success: true,
//       message: "Login successful",
//       redirectTo: "/dashboard",
//     };
//   } catch (error) {
//     // if (error instanceof AuthError) return handleAuthError(error);
//     throw error;
//   }
// }

// ----------------------------------------------------------------

// import { db } from "@/lib/db";

// export async function toggleTwoFactor(userId: string, enabled: boolean) {
//   try {
//     await db.user.update({
//       where: { id: userId },
//       data: {
//         twoFactorEnabled: enabled,
//       },
//     });

//     return {
//       success: true,
//       message: enabled ? "2FA has been enabled" : "2FA has been disabled",
//     };
//   } catch (error) {
//     return {
//       success: false,
//       message: "Failed to update 2FA settings",
//     };
//   }
// }
