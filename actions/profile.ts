"use server";
import { db } from "@/lib/db";
import { UpdateProfileSchema, UpdateProfileValues } from "@/prisma/schemas";
import { auth } from "@/lib/auth";

export const updateProfile = async (data: UpdateProfileValues) => {
  const session = await auth();

  const validatedData = UpdateProfileSchema.parse(data);
  const { name, bio, dob, gender, phone, profileImageUrl } = validatedData;

  await db.profile.update({
    where: { userId: session?.user?.id },
    data: { name, bio, birthDate: dob, gender, phone, profileImageUrl },
  });

  return {
    success: true,
    message: "Profile updated successfully",
  };
};
