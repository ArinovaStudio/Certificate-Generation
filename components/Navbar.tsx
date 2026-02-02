"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building, User, Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "./ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ListItem from "./ListItem";

export default function Navbar() {
  const navLinks = ["Media", "Pricing"];

  return (
    <header className="flex items-center justify-between px-6 py-4 w-full">
      {/* Logo */}
      <div className="text-xl font-bold">ARINOVA STUDIO</div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
              <NavigationMenuContent className="w-96 max-w-140">
                <ul className="grid gap-1">
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <ListItem
                        key={index}
                        link="#"
                        text={`Link ${index + 1}`}
                      />
                    ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {navLinks.map((link) => (
              <NavigationMenuItem key={link}>
                <NavigationMenuLink asChild>
                  <Link href="#">{link}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

            <div className="max-w-3xl w-full"></div>
      {/* Desktop Buttons */}
      {/* <div className="hidden md:flex items-center gap-3">
        <Button variant="outline" size="sm">
          <Building /> Enterprise Login
        </Button>
        <Button className="bg-blue-700" size="sm">
          Try for free
        </Button>
        <Button variant="outline" size="sm">
          <User /> Recipient Login
        </Button>
      </div> */}

      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-72 p-5">
            <div className="flex flex-col gap-6 mt-6">
              {/* Mobile Links */}
              <div className="flex flex-col gap-4 text-sm">
                <span className="font-medium">Solutions</span>
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <Link
                      key={index}
                      href="#"
                      className="text-muted-foreground pl-2"
                    >
                      {">"} Link {index + 1}
                    </Link>
                  ))}

                {navLinks.map((link,index) => (
                  <Link key={index} href="#">
                    {link}
                  </Link>
                ))}
              </div>

              {/* Mobile Buttons */}
              {/* <div className="flex flex-col gap-3 pt-4 border-t">
                <Button variant="outline">
                  <Building /> Enterprise Login
                </Button>
                <Button className="bg-blue-700">
                  Try for free
                </Button>
                <Button variant="outline">
                  <User /> Recipient Login
                </Button>
              </div> */}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
