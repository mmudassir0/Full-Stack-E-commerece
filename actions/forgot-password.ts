"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import crypto from "crypto";
import { sendMail } from "@/lib/mail";
import { ForgetPasswordValue } from "@/prisma/schemas";

export async function forgotPasswordAction(formData: ForgetPasswordValue) {
  try {
    const { email } = formData;

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, message: "No account found with this email" };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await db.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      },
    });

    // Email template
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    const emailContent = `
     <h1>Reset Your Password</h1>
      <p>Click the link below to reset your password:</p>
      ${resetUrl}

      <p>This link will expire in 1 hour.
      If you didn't request this, please ignore this email.</p>
        <p>If you didn't request this, please ignore this email.</p>
    `;

    // Send email

    await sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: emailContent,
    });

    return { success: true, message: "Reset password link sent to your email" };
  } catch (error) {
    console.log(error, "error");
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Invalid email format",
      };
    }
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
