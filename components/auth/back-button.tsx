import Link from "next/link";
import React from "react";
import { Separator } from "../ui/separator";

interface BackButtonProps {
  label: string;
  href: string;
  linkLabel: string;
}

const BackButton = ({ href, label, linkLabel }: BackButtonProps) => {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="w-full my-5">
        <Separator />
      </div>
      <div className="">
        {label}{" "}
        <Link href={href} className="text-blue-700 hover:underline">
          {linkLabel}
        </Link>
      </div>
    </div>
  );
};

export default BackButton;
