"use client";

import Link from "next/link";
import Button from "@/components/flowbite/Button";
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
import Image from "next/image";

export default function Navbar() {
  const navLinks = ["Media", "Pricing"];

  return (
    <header className="flex items-center justify-between px-6 py-4 w-full">
      {/* Logo */}
      <div className="text-xl font-bold flex items-center gap-2">
        <Image
          src={"/logo.jpg"}
          alt={"Logo"}
          height={30}
          width={30}
          className="rounded-lg"
        />{" "}
        ARINOVA STUDIO
      </div>

      <div className="max-w-3xl w-full"></div>
      {/* Desktop Buttons */}
      <div className="flex items-center gap-3">
        <Link href={"/login"}>
          <Button>
            <User /> Login
          </Button>
        </Link>
      </div>
    </header>
  );
}
