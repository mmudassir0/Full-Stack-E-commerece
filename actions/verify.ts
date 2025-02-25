// actions/verify.ts
"use server";

import { db } from "@/lib/db";
import { decrypt } from "@/lib/encryption";

export async function verifyCode(userId: string, code: string, token: string) {
  console.log("userId", userId, code, "code");
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        password: true,
        twoFactorCode: true,
        twoFactorCodeExpires: true,
      },
    });
    console.log(user, "user is found");

    if (!user || !user.twoFactorCode || !user.twoFactorCodeExpires) {
      return { success: false, message: "Invalid verification code" };
    }

    if (user.twoFactorCode !== code) {
      return { success: false, message: "Invalid verification code" };
    }
    // 698179
    if (new Date() > user.twoFactorCodeExpires) {
      return { success: false, message: "Verification code expired" };
    }
    const credentials = await decrypt(token);

    return {
      success: true,
      message: "Login successful",
      credentials,
    };
  } catch (error) {
    console.error("Verification error:", error);
    return { success: false, message: "Verification failed" };
  }
}
