import React from "react";
import { Separator } from "../ui/separator";

interface CardHeaderProps {
  label: string;
}
const Header = ({ label }: CardHeaderProps) => {
  return (
    <div className="flex justify-center items-center flex-col w-full gap-y-2">
      <h1 className="text-3xl font-bold  mb-4">{label}</h1>

      <Separator />
    </div>
  );
};

export default Header;
