// import { auth } from "@/lib/auth";
// import { redirect } from "next/navigation";
import VerifyCard from "@/components/auth/verifyCard";
import React from "react";

const VerifyPage = async () => {
  //   const session = await auth();

  //   if (session) {
  //     redirect("/");
  //   }
  return (
    <>
      <VerifyCard />
    </>
  );
};

export default VerifyPage;
