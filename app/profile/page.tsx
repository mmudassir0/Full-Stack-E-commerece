import Profile from "@/components/profile";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import React from "react";

const ProfilePage = async () => {
  const session = await auth();

  const userData = await db.user.findUnique({
    where: {
      id: session?.user?.id,
    },
    select: {
      email: true,
      profile: true,
    },
  });

  return <Profile session={session} userData={userData} />;
};

export default ProfilePage;
