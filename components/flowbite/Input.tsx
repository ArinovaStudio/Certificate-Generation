"use client";
import React from "react";
import { useTheme } from "next-themes";
export default function Input({...props}) {
    const {theme} = useTheme();
    const isDark = theme==="dark";
  const inputBase = `w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all duration-200`;
  const inputTheme = isDark
    ? "bg-[#0f1219] border-gray-700 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
    : "bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";
  return <input className={`${inputBase} ${inputTheme}`} {...props}/>;
}
