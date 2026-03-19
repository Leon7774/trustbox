import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
        {/* Navigation Bar can be added here */}
        <header className="w-full h-16 border-b border-trust-border backdrop-blur-md bg-trust-dark/50 flex items-center justify-center sticky top-0 z-50">
          <div className="w-full max-w-6xl px-4 flex justify-between items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-trust-blue to-trust-teal bg-clip-text text-transparent">
              TRUSTBOX
            </h1>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center w-full max-w-6xl mx-auto px-4 py-8 md:py-12">
          {children}
        </main>
      </body>
    </html>
  );
}
