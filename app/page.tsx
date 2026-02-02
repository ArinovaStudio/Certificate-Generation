import AnalyticsSection from "@/components/landing/Analytics";
import BrandingSection from "@/components/landing/Branding";
import HeroSection from "@/components/landing/HeroSection";
import Image from "next/image";
import Navbar from "@/components/Navbar";
export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <BrandingSection />
      <AnalyticsSection />
    </div>
  );
}
