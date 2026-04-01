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
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TrustBox | Personal Cyber Risk Scoring",
  description:
    "Behavioral-Based Cyber Risk Scoring with Assessment and Feedback System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(`dark h-full antialiased`)}>
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} ${spaceGrotesk.className} ${manrope.variable} min-h-full flex flex-col text-slate-100 bg-trust-dark`}
      >
        <header className="inset-x-0 h-16 border-b border-trust-border backdrop-blur-md bg-trust-dark/50 flex items-center justify-center sticky top-0 z-50">
          <div className="w-full max-w-6xl px-4 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/">
                <Image
                  src="/logo.svg"
                  className="w-10"
                  alt="TrustBox Logo"
                  width={100}
                  height={40}
                />
              </Link>
              <Link href="/">
                <Image
                  src="/name.svg"
                  className="w-40 fill-white"
                  alt="TrustBox Logo"
                  width={100}
                  height={40}
                />
              </Link>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-trust-surface border border-transparent hover:border-trust-border transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center w-full max-w-6xl mx-auto px-4 py-8 md:py-12">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
