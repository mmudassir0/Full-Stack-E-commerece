import SignUpCard from "@/components/auth/signupCard";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const SignUpPage = async () => {
  const session = await auth();

  if (session) {
    redirect("/");
  }
  return (
    <>
      <SignUpCard />
    </>
  );
};

export default SignUpPage;
