import React from "react";
import { Separator } from "../ui/separator";
import Link from "next/link";

const footerLinks = [
  {
    title: "Shop",
    links: [
      { name: "Women", href: "/category/women" },
      { name: "Men", href: "/category/men" },
      { name: "Accessories", href: "/category/accessories" },
      { name: "Sale", href: "/sale" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
      { name: "Affiliates", href: "/affiliates" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "FAQ", href: "/faq" },
      { name: "Shipping", href: "/shipping" },
      { name: "Returns", href: "/returns" },
      { name: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
  },
];

const Footer = () => {
  return (
    <div className="bg-gray-900 text-gray-300  py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 ">
          {footerLinks.map((footer) => {
            return (
              <div key={footer.title} className="">
                <h3 className="text-xl font-semibold">{footer.title}</h3>
                <div className="mt-3 flex flex-col gap-y-1">
                  {footer.links.map((link) => {
                    return (
                      <Link href={link.href} className="hover:text-white/60">
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <Separator className="bg-white/10 my-10" />
        <div className="text-center">© 2024 MAStore. All rights reserved.</div>
      </div>
    </div>
  );
};

export default Footer;
