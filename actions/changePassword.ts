"use server";

import { auth } from "@/lib/auth";
import { updatePassword } from "@/lib/passwordHistory";
import { UpdateNewPasswordValues } from "@/prisma/schemas";

export const updateNewPassword = async (data: UpdateNewPasswordValues) => {
  const session = await auth();
  const userId = session?.user?.id;
  const { currentPassword, newPassword } = data;

  const res = updatePassword(userId!, currentPassword, newPassword);

  return res;
};
