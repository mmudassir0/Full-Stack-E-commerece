import { AUTH_CONSTANTS } from "./constants";
import { db } from "./db";
import bcrypt from "bcryptjs";

interface AuthResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  redirectTo?: string;
  userId?: string;
  requiresTwoFactor?: boolean;
}

export async function isPasswordReused(
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
        message: "Password changed recently. Please try again later.",
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
