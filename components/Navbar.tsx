"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/CustomButton";
import { User, ArrowUpRight, Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b bg-white">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 text-xl font-bold">
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={30}
            height={30}
            className="rounded-lg"
          />
          <span className="hidden sm:block">ARINOVA STUDIO</span>
        </div>

        {/* Desktop buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="https://www.arinova.studio/" target="_blank">
            <Button>
              <ArrowUpRight className="mr-1" />
              Visit Arinova Studio
            </Button>
          </Link>

          <Link href="/login">
            <Button>
              <User className="mr-1" />
              Login
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-6 pb-4 grid gap-3 max-w-80 mx-auto bg-white">
          <Link
            href="https://www.arinova.studio/"
            target="_blank"
            onClick={() => setOpen(false)}
          >
            <Button className="w-full justify-center">
              <ArrowUpRight className="mr-1" />
              Visit Arinova Studio
            </Button>
          </Link>

          <Link href="/login" onClick={() => setOpen(false)}>
            <Button className="w-full justify-center">
              <User className="mr-1" />
              Login
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
