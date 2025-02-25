"use client";
import React from "react";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { AiOutlineGithub, AiOutlineGoogle } from "react-icons/ai";
import { motion } from "framer-motion";

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
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size={"lg"}
          className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => {
            onClick("google");
          }}
        >
          <AiOutlineGoogle />
          Google
        </Button>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size={"lg"}
          className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => {
            onClick("github");
          }}
        >
          <AiOutlineGithub />
          Github
        </Button>
      </motion.div>
    </div>
  );
};

export default Social;
