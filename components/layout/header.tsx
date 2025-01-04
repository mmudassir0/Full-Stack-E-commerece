import Link from "next/link";
import { ShoppingCart, CircleUserRound, Search, Menu } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href={"/"} className="text-2xl font-bold">
              MAStore
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href={"/collections/new"} className="">
              New Arrivals
            </Link>
            <Link href={"/collections/men"}>Men</Link>
            <Link href={"/collections/women"}>Women</Link>
            <Link href={"/collections/accessries"}>Accessries</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant={"ghost"} size={"icon"}>
              <Search className="h-5 w-5" />
            </Button>
            <Button variant={"ghost"} size={"icon"}>
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                  <CircleUserRound className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href={"/signin"} className="">
                    Signin
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={"/signup"}>Signup</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} size={"icon"}>
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href={"/new"} className="">
                      New Arrivals
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={"/men"}>Men</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={"/women"}>Women</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={"accessries"}>Accessries</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
