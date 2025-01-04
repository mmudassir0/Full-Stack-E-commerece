"use client";
import React from "react";
import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

const onClick = (provider: "google" | "github") => {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  signIn(provider),
    {
      callbackUrl: "/dashboard",
    };
};

// const openOAuthWindow = () => {
//   const clientId = 'YOUR_CLIENT_ID';
//   const redirectUri = 'YOUR_REDIRECT_URI';
//   const scope = 'YOUR_SCOPES';
//   const prompt = 'consent'; // Ensures the consent screen is shown

//   const authUrl = `https://accounts.google.com/o/oauth2/auth?` +
//       `client_id=${clientId}&` +
//       `redirect_uri=${redirectUri}&` +
//       `response_type=code&` +
//       `scope=${scope}&` +
//       `prompt=${prompt}`;

//   window.open(authUrl, '_blank', 'width=600,height=600'); // Opens in new window
// };

const Social = () => {
  return (
    <div className="grid grid-cols-2 w-full gap-4">
      {/* <Separator /> */}
      <Button
        size={"lg"}
        variant={"outline"}
        className="w-full"
        onClick={() => {
          onClick("google");
        }}
      >
        <FcGoogle />
        Google
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
        Github
      </Button>
    </div>
  );
};

export default Social;
