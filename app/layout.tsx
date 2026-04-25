// src/app/layout.tsx
import type { Metadata } from "next";
import {
  Outfit,
  JetBrains_Mono,
  Geist,
  Space_Grotesk,
  Manrope,
} from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@/app/components/UserButton";
import { getAuthUser } from "@/app/actions/authActions"; // Your clean DAL function
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TrustBox | Personal Cyber Risk Scoring",
  description:
    "Behavioral-Based Cyber Risk Scoring with Assessment and Feedback System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authUser = await getAuthUser();

  return (
    <html lang="en" className={cn("dark h-full antialiased")}>
      <body
        // Inject all 5 CSS variables into the body so they are available globally
        className={cn(
          // geist.variable,
          // outfit.variable,
          spaceGrotesk.className,
          manrope.variable,

          "min-h-full flex flex-col text-slate-100 bg-trust-dark font-sans", // Assuming one of these maps to font-sans in Tailwind
        )}
      >


        <main className="flex-1 flex flex-col items-center w-full mx-auto">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
