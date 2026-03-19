import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TrustBox | Personal Cyber Risk Scoring",
  description: "Behavioral-Based Cyber Risk Scoring with Assessment and Feedback System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className={`${outfit.variable} ${jetbrainsMono.variable} min-h-full flex flex-col font-sans text-slate-100 bg-trust-dark`}>
        <header className="w-full h-16 border-b border-trust-border backdrop-blur-md bg-trust-dark/50 flex items-center justify-center sticky top-0 z-50">
          <div className="w-full max-w-6xl px-4 flex justify-start items-center">
            <Image src="/logo.svg" className="w-10" alt="TrustBox Logo" width={100} height={40} />
            <Image src="/name.svg" className="w-40 fill-white" alt="TrustBox Logo" width={100} height={40} />
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center w-full max-w-6xl mx-auto px-4 py-8 md:py-12">
          {children}
        </main>
      </body>
    </html>
  );
}
