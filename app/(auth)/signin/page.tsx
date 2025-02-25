import SignInCard from "@/components/auth/signinCard";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const SignInPage = async () => {
  const session = await auth();

  if (session) {
    redirect("/");
  }
  return (
    <>
      <SignInCard />
    </>
  );
};

export default SignInPage;
