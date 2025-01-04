import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import Header from "./card-header";
import Social from "./social";
import BackButton from "./back-button";

interface CardWrapperProps {
  headerlabel: string;
  href: string;
  label: string;
  linkLabel: string;
  children: React.ReactNode;
}
const CardWrapper = ({
  headerlabel,
  children,
  href,
  label,
  linkLabel,
}: CardWrapperProps) => {
  return (
    <div className="relative md:min-h-screen md:flex items-center justify-center w-full bg-gradient-to-br from-purple-300 to-blue-200">
      {/* Abstract shapes */}
      <div className="absolute top-0 left-0 min-w-60 min-h-60 md:w-96 md:h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-sm opacity-70 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 min-w-60 min-h-60 md:w-96 md:h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-sm opacity-70 animate-pulse delay-700"></div>

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20"
        style={{
          backgroundImage: `linear-gradient(transparent 0px, transparent 1px, white 1px, white 2px),
                              linear-gradient(90deg, transparent 0px, transparent 1px, white 1px, white 2px)`,
          backgroundSize: "32px 32px",
        }}
      ></div>

      <div className="relative z-10 flex items-center justify-center py-20 mx-6 ">
        <Card className="w-[430px] shadow-md">
          <CardHeader>
            <Header label={headerlabel} />
          </CardHeader>

          <CardContent>{children}</CardContent>

          <CardFooter className="flex flex-col">
            <Social />
            <BackButton href={href} label={label} linkLabel={linkLabel} />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CardWrapper;
