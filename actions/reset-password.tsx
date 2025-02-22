"use server";
import { z } from "zod";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { ResetPasswordSchema, ResetPasswordValue } from "@/prisma/schemas";

export async function resetPassword(
  formData: ResetPasswordValue,
  token: string
) {
  try {
    if (!token) {
      return { success: false, message: "Token required for password reset" };
    }
    const validatedFields = ResetPasswordSchema.parse(formData);

    // Find user by reset token and check if it's expired
    const user = await db.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return { success: false, message: "Invalid or expired reset token" };
    }

    // // Check if new password is different from current
    const isSamePassword = await bcrypt.compare(
      validatedFields.password,
      user.password || ""
    );
    if (isSamePassword) {
      return {
        success: false,
        message: "New password must be different from current password",
      };
    }

    // // Check password history
    const recentPasswords = await db.passwordHistory.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3, // Last 3 passwords
    });

    for (const historyEntry of recentPasswords) {
      const matchesHistory = await bcrypt.compare(
        validatedFields.password,
        historyEntry.password
      );
      if (matchesHistory) {
        return {
          success: false,
          message:
            "Password has been used recently. Please choose a different password.",
        };
      }
    }

    // // Hash new password
    const hashedPassword = await bcrypt.hash(validatedFields.password, 12);

    // Start a transaction to update password and related fields
    await db.$transaction(async (tx) => {
      // Store the old password in history
      if (user.password) {
        await tx.passwordHistory.create({
          data: {
            userId: user.id,
            password: user.password,
          },
        });
      }

      //   // Update user
      await tx.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null,
          lastPasswordChange: new Date(),
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      });
    });

    return {
      success: true,
      message:
        "Password reset successfully. You can now login with your new password.",
    };
  } catch (error) {
    console.error("Reset password error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
