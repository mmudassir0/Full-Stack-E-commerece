import Link from "next/link";
import { ShoppingCart, CircleUserRound, Search, Menu } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
            <Link href={"/new"} className="">
              New Arrivals
            </Link>
            <Link href={"/men"}>Men</Link>
            <Link href={"/women"}>Women</Link>
            <Link href={"accessries"}>Accessries</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant={"ghost"} size={"icon"}>
              <Search className="h-5 w-5" />
            </Button>
            <Button variant={"ghost"} size={"icon"}>
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button variant={"ghost"} size={"icon"}>
              <CircleUserRound className="h-5 w-5" />
            </Button>

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
      {/* <div className="container m-auto flex justify-between items-center">
        <div className="text-2xl font-bold">MAStore</div>
        <div className="space-x-16 ">
          <Link href={""} className="">
            New Arrivals
          </Link>
          <Link href={""}>Men</Link>
          <Link href={""}>Women</Link>
          <Link href={""}>Accessries</Link>
        </div>
        <div className="flex gap-x-10 text-gray-700">
          <Search />
          <ShoppingCart />
          <CircleUserRound />
        </div>
      </div> */}
    </header>
  );
};

export default Header;
