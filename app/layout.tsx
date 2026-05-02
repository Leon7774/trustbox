// src/app/layout.tsx
import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";
import { getAuthUser } from "@/lib/auth"; // Your clean DAL function
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { useUser } from "@/hooks/useUser";
import { UserProvider } from "@/components/providers/UserProvider";

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
  const user = await getAuthUser();

  return (
    <html lang="en" className={cn("dark h-full antialiased")}>
      <body
        // Inject all 5 CSS variables into the body so they are available globally
        className={cn(
          spaceGrotesk.className,
          manrope.variable,

          "min-h-full flex flex-col text-slate-100 bg-trust-dark font-sans", // Assuming one of these maps to font-sans in Tailwind
        )}
      >
        <UserProvider serverUser={user}>{children}</UserProvider>
        <Toaster />
      </body>
    </html>
  );
}
