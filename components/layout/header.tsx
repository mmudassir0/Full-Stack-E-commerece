"use client";
import React, { useState } from "react";
import {
  ShoppingCart,
  Search,
  User,
  Menu,
  X,
  Heart,
  ShoppingBag,
  Settings,
  LogOut,
} from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { logout } from "@/actions/auth";

const NavigationBar = ({ session }: { session: Session | null }) => {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [cartCount, setCartCount] = useState(3);

  const NavLinks = [
    {
      label: "New Arrivals",
      href: "/collections/new",
    },
    {
      label: "Collections",
      href: "/collections",
    },
    {
      label: "Men",
      href: "/collections/men",
    },
    {
      label: "Women",
      href: "/collections/women",
    },
    {
      label: "Accessories",
      href: "/collections/accessories",
    },
  ];
  return (
    <nav
      className={`sticky top-0 w-full z-50 transition-all duration-300 text-gray-100 border-b border-gray-500  bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] `}
    >
      {/* Main Navigation Container */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 text-gray-100">
          <div
            className="flex-shrink-0 font-bold text-2xl cursor-pointer 
                         transition-transform duration-300 hover:scale-105"
          >
            <Link href={"/"}>MA-Store</Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-8">
            {NavLinks.map((item) => (
              <div key={item.label} className="relative group">
                <Link
                  href={item.href}
                  className="text-gray-100 hover:text-white transition-colors duration-300 
                           py-2 inline-block cursor-pointer"
                >
                  {item.label}
                </Link>
                <div
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all 
                             duration-300 group-hover:w-full"
                ></div>
              </div>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Search Bar */}
            <div
              className={`relative transition-all duration-300 ${
                searchFocused ? "w-64" : "w-48"
              }`}
            >
              <input
                type="text"
                placeholder="Search..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full px-4 py-1 rounded-full bg-gray-100 focus:bg-gray-200 
                        transition-all duration-300 focus:outline-none pr-10"
              />
              <Search
                className="absolute right-3 top-1/2 transform -translate-y-1/2 
                              text-gray-400 h-4 w-4"
              />
            </div>

            {/* Wishlist */}
            <div className="relative group">
              <Heart
                className="h-6 w-6  group-hover:text-red-500 
                             transition-colors duration-300 cursor-pointer"
              />
              <div
                className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full 
                           flex items-center justify-center text-white text-xs"
              >
                2
              </div>
            </div>

            {/* Shopping Cart */}
            <div className="relative group">
              <ShoppingCart
                className="h-6 w-6  group-hover:text-black 
                                   transition-colors duration-300 cursor-pointer"
              />
              <div
                className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white rounded-full 
                           flex items-center justify-center  text-xs"
              >
                {cartCount}
              </div>
              {/* Cart Preview */}
              <div
                className="absolute right-0 top-full mt-2 w-72 bg-white shadow-xl 
                           rounded-lg opacity-0 invisible group-hover:opacity-100 
                           group-hover:visible transition-all duration-300 transform 
                           translate-y-2 group-hover:translate-y-0"
              >
                <div className="p-4">
                  <div className="text-sm font-medium mb-2">Shopping Cart</div>
                  <div className="text-xs text-gray-500">
                    {cartCount} items in cart
                  </div>
                </div>
              </div>
            </div>
            {/* User Account */}

            <div>
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {/* <Button
                      variant="ghost"
                      size="lg"
                      className="relative rounded-full bg-slate-400"
                    ></Button> */}
                    {/* <UserCircle className="h-6 w-6" /> */}
                    <Avatar>
                      <AvatarImage
                        src="/images/avatar-person.svg"
                        alt="User Icon"
                      />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {session?.user?.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session?.user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className={`cursor-pointer ${
                        path === "/profile" ? "bg-muted text-foreground" : ""
                      }`}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <Link href={"/profile"}>Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={`cursor-pointer ${
                        path === "/order" ? "bg-muted text-foreground" : ""
                      }`}
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      <Link href={"/order"}>Orders</Link>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem>
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Billing</span>
                    </DropdownMenuItem> */}
                    <DropdownMenuItem
                      className={` cursor-pointer ${
                        path === "/setting" ? "bg-muted text-foreground" : ""
                      }`}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <Link href={"/setting"}>Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 cursor-pointer"
                      onClick={() => {
                        logout();
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href={path === "/signin" ? "/signup" : "/signin"}>
                  <User
                    className="h-6 w-6  hover:scale-125 transition-colors 
              duration-300 cursor-pointer"
                  />
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md 
                      text-gray-600 hover:text-black focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6 transition-transform duration-300 rotate-90 text-gray-100" />
              ) : (
                <Menu className="h-6 w-6 transition-transform duration-300 text-gray-100" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-screen opacity-100 visible"
            : "max-h-0 opacity-0 invisible"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-2 bg-white shadow-lg bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
          {NavLinks.map((item) => (
            <Link
              href={item.href}
              key={item.label}
              className="block px-3 py-2 text-gray-100 hover:text-black 
                      hover:bg-gray-50 rounded-md transition-colors duration-300"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4 px-3">
              <Search className="h-5 w-5 text-gray-100" />
              <User className="h-5 w-5 text-gray-100" />
              <Heart className="h-5 w-5 text-gray-100" />
              <div className="relative">
                <ShoppingCart className="h-5 w-5 text-gray-100" />
                <div
                  className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full 
                             flex items-center justify-center text-white text-xs"
                >
                  {cartCount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;

// const Header = () => {
//   return (
//     <header className="border-b">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex items-center">
//             <Link href={"/"} className="text-2xl font-bold">
//               MAStore
//             </Link>
//           </div>
//           <nav className="hidden md:flex items-center space-x-8">
//             <Link href={"/collections/new"} className="">
//               New Arrivals
//             </Link>
//             <Link href={"/collections/men"}>Men</Link>
//             <Link href={"/collections/women"}>Women</Link>
//             <Link href={"/collections/accessries"}>Accessries</Link>
//           </nav>
//           <div className="flex items-center space-x-4">
//             <Button variant={"ghost"} size={"icon"}>
//               <Search className="h-5 w-5" />
//             </Button>
//             <Button variant={"ghost"} size={"icon"}>
//               <ShoppingCart className="h-5 w-5" />
//             </Button>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant={"ghost"} size={"icon"}>
//                   <CircleUserRound className="h-5 w-5" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuItem>
//                   <Link href={"/signin"} className="">
//                     Signin
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem>
//                   <Link href={"/signup"}>Signup</Link>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>

//             <div className="md:hidden">
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant={"ghost"} size={"icon"}>
//                     <Menu className="h-5 w-5" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuItem>
//                     <Link href={"/new"} className="">
//                       New Arrivals
//                     </Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem>
//                     <Link href={"/men"}>Men</Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem>
//                     <Link href={"/women"}>Women</Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem>
//                     <Link href={"accessries"}>Accessries</Link>
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
