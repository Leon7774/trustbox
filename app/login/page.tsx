import LoginCard from "./_components/login-section/LoginCard";
import BackGroundVideo from "./_components/login-section/BackgroundVideo";
import HeroSection from "./_components/hero-section/HeroSection";
import Footer from "./_components/Footer";

export default function LoginPage() {
  return (
    <>
      {/* Background Video */}
      <BackGroundVideo />

      {/* Login Section */}
      <LoginCard />

      {/* Hero Section */}
      <HeroSection />

      {/* Footer */}
      <Footer />
    </>
  );
}
