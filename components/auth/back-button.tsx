import Link from "next/link";
import React from "react";

interface BackButtonProps {
  label: string;
  href: string;
  linkLabel: string;
}

const BackButton = ({ href, label, linkLabel }: BackButtonProps) => {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="text-center text-blue-200">
        {label}{" "}
        <Link
          href={href}
          className="text-white hover:text-purple-300 transition-colors duration-200"
        >
          {linkLabel}
        </Link>
      </div>
    </div>
  );
};

export default BackButton;
