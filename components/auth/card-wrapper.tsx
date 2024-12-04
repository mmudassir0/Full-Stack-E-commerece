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
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label={headerlabel} />
      </CardHeader>

      <CardContent>{children}</CardContent>
      <CardFooter className="flex flex-col">
        <Social />
        <BackButton href={href} label={label} linkLabel={linkLabel} />
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
