import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/Layout";
import { geistSans, geistMono } from "@/lib/fonts";
import ThemeProvider from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
export const metadata: Metadata = {
  title: "Certificate Verifier - Arinova Studio",
  description: "Arinova Studio’s Certificate Verifier helps you confirm genuine certificates with confidence. Prevent fraud with secure and accurate verification.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute={"class"} enableSystem defaultTheme="light">
          <Toaster/>
        <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
