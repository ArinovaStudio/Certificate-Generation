"use client";
import React from "react";
import { useEffect } from "react";
import { useTheme } from "next-themes";
export default function Layout({
  children,
  ...props
}: React.PropsWithChildren) {
  const { setTheme } = useTheme();
useEffect(() => {
  const handler = (e: MouseEvent) => e.preventDefault();
  document.addEventListener("contextmenu", handler);
  return () => document.removeEventListener("contextmenu", handler);
}, []);
useEffect(() => {
  document.addEventListener("contextmenu", e => e.preventDefault());
  document.addEventListener("selectstart", e => e.preventDefault());
}, []);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
        alert("Printing is disabled on this page.");
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        navigator.clipboard.writeText("");
        alert("Screenshot attempt detected.");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    setTheme("light");
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  return (
    <div className="min-h-screen grid w-full" {...props}>
      {children}
    </div>
  );
}
