"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TypeAnimation } from "react-type-animation";
import LoginForm from "./LoginForm";

export default function LoginCard() {
  return (
    <div
      id="login-section"
      className="inset-x-0 h-[calc(100vh-64px)] flex flex-col lg:flex-row items-center justify-start relative overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row w-full justify-center lg:pb-20">
        {/* Left Card */}
        <Card className="w-full max-w-92 rounded-tr-none flex-col lg:rounded-br-none relative z-10 border-trust-border/50 border-r-0 bg-background/90 shadow-2xl p-2 sm:p-4 lg:p-10 flex items-center">
          <TypeAnimation
            sequence={[
              "Secure your digital life.",
              2000, // pause for 2 seconds
              "Get assessed now!",
              2000,
              "Powered by AI.",
              2000,
            ]}
            wrapper="h1"
            speed={20}
            deletionSpeed={70}
            className="text-brand-primary font-manrope font-semibold text-5xl min-h-[80px] sm:min-h-[96px] lg:min-h-[204px] w-full"
            repeat={Infinity}
            cursor={true}
          />
          TrustBox is your personal companion for assessing your digital safety.
          Get started by signing up now!
        </Card>

        {/* Right Card */}
        <Card className="w-full max-w-140 rounded-tl-none rounded-bl-none relative z-10 border-trust-border/50 border-l-0 bg-trust-surface/80 backdrop-blur-2xl shadow-2xl p-2 sm:p-4">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-2xl font-semibold tracking-tight text-white">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-slate-400">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <LoginForm />
        </Card>
      </div>
    </div>
  );
}
