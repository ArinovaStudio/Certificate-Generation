"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/CustomButton";
import { User, ArrowUpRight, Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b bg-white absolute inset-0 h-fit">
      <div className="flex items-center justify-between sm:px-20 px-4 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2 text-xl font-bold">
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={45}
            height={45}
          />
        </div>

        {/* Desktop buttons */}
        <div className="hidden md:flex items-center gap-3 cursor-pointer">
          <Link href="https://www.arinova.studio/" target="_blank">
            <Button className="px-12">
              Arinova Studio
              <ArrowUpRight className="mr-1" />
            </Button>
          </Link>

          <Link href="/login">
            <Button className="px-10">
              <User className="mr-0.5" />
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
              Arinova Studio
              <ArrowUpRight className="mr-1" />
            </Button>
          </Link>

          <Link href="/login" onClick={() => setOpen(false)}>
            <Button className="w-full justify-center">
              <User className="mr-0.5" />
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
