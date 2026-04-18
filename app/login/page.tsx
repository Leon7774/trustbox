"use client";

import { useRouter } from "next/navigation";
import LoginCard from "./_components/login-section/LoginCard";
import BackGroundVideo from "./_components/login-section/BackgroundVideo";
import HeroSection from "./_components/hero-section/HeroSection";

export default function LoginPage() {
  const router = useRouter();

  return (
    <>
      {/* Background Video */}
      <BackGroundVideo />

      {/* Login Section */}
      <LoginCard />

      {/* Hero Section */}
      <HeroSection />
    </>
  );
}
