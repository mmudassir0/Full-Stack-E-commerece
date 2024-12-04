"use client";
import React from "react";
import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { Separator } from "../ui/separator";

const onClick = (provider: "google" | "github") => {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  signIn(provider),
    {
      callbackUrl: "/setting",
    };
};

const Social = () => {
  return (
    <div className="flex flex-col items-center gap-y-4 w-full">
      <Separator />
      <Button
        size={"lg"}
        variant={"outline"}
        className="w-full"
        onClick={() => {
          onClick("google");
        }}
      >
        <FcGoogle />
        Continue with Google
      </Button>
      <Button
        size={"lg"}
        variant={"outline"}
        className="w-full"
        onClick={() => {
          onClick("github");
        }}
      >
        <FaGithub />
        Continue with Github
      </Button>
    </div>
  );
};

export default Social;
