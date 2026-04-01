"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { TypeAnimation } from "react-type-animation"; // <-- Boom, imported.

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);
    if (result?.error) {
      setError(result.error);
      toast.error(result.error, { position: "top-right" });
      setLoading(false);
    }
  };

  return (
    <>
<<<<<<< HEAD
      <div className="w-full py-20 flex flex-col items-center justify-start p-4 relative overflow-hidden">
        <Card className="w-full max-w-[420px] relative z-10 border-trust-border/50 bg-trust-surface/80 backdrop-blur-2xl shadow-2xl p-2 sm:p-4">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-2xl font-semibold tracking-tight text-white">
              Welcome Back Otin Lubot
            </CardTitle>
            <CardDescription className="text-slate-400">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  className="bg-trust-dark/60 border-trust-border/60 focus:border-trust-teal"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-300">Password</Label>
                  <Link href="#" className="text-sm font-medium text-trust-teal hover:text-trust-blue hover:underline transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="bg-trust-dark/60 border-trust-border/60 focus:border-trust-teal"
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-5 pt-4">
              <Button
                type="submit"
                className="w-full bg-linear-to-r from-trust-blue to-trust-teal hover:from-trust-blue/90 hover:to-trust-teal/90 text-white font-medium shadow-lg hover:shadow-trust-blue-glow/50 transition-all"
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : "Sign In"}
              </Button>

              <p className="text-center text-sm text-slate-400">
                Don't have an account?{" "}
                <Link href="/register" className="font-semibold text-white hover:text-trust-teal transition-colors">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

      </div>
      <video className="h-full absolute z-0 inset-0 w-full object-cover" muted autoPlay loop playsInline>
        <source src="https://storage.googleapis.com/gweb-gemini-cdn/gemini/uploads/89e9004d716a7803fc7c9aab18c985af783f5a36.mp4" type="video/mp4" />
=======
      <video
        className="h-full absolute -z-10 inset-0 w-full object-cover hidden sm:block"
        muted
        autoPlay
        loop
        playsInline
      >
        <source
          src="https://storage.googleapis.com/gweb-gemini-cdn/gemini/uploads/89e9004d716a7803fc7c9aab18c985af783f5a36.mp4"
          type="video/mp4"
        />
>>>>>>> origin/master
      </video>
      <div className="w-full py-20 flex flex-col items-center justify-start p-4 relative overflow-hidden">
        <div className="flex w-full justify-center">
          <Card className="w-full max-w-[320px] rounded-tr-none flex flex-col rounded-br-none relative z-10 border-trust-border/50 border-r-0 bg-background/90 shadow-2xl p-2 sm:p-4 lg:p-10 flex items-center">
            {/* Replaced your raw HTML with the component */}
            <TypeAnimation
              sequence={[
                "Secure your digital life.",
                2000, // pause for 2 seconds
                "Get assessed now!",
                2000,
                "Powered by AI.",
                2000,
              ]}
              wrapper="p"
              speed={20}
              deletionSpeed={70}
              className="text-brand-primary font-manrope font-semibold text-5xl min-h-[80px] sm:min-h-[96px] lg:min-h-[204px] w-full"
              repeat={Infinity}
              cursor={true}
            />
            TrustBox is your personal companion for assessing your digital
            safety. Get started by signing up now!
          </Card>
          <Card className="w-full max-w-[420px] rounded-tl-none rounded-bl-none relative z-10 border-trust-border/50 border-l-0 bg-trust-surface/80 backdrop-blur-2xl shadow-2xl p-2 sm:p-4">
            <CardHeader className="space-y-2 text-center pb-6">
              <CardTitle className="text-2xl font-semibold tracking-tight text-white">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-slate-400">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleLogin}>
              {/* ... Rest of your form stays exactly the same ... */}
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    className="bg-trust-dark/60 border-trust-border/60 focus:border-trust-teal"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-slate-300">
                      Password
                    </Label>
                    <Link
                      href="#"
                      className="text-sm font-medium text-trust-teal hover:text-trust-blue hover:underline transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    className="bg-trust-dark/60 border-trust-border/60 focus:border-trust-teal"
                    required
                  />
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-5 pt-4">
                <Button
                  type="submit"
                  className="w-full bg-linear-to-r from-trust-blue to-trust-teal hover:from-trust-blue/90 hover:to-trust-teal/90 text-white font-medium shadow-lg hover:shadow-trust-blue-glow/50 transition-all"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <p className="text-center text-sm text-slate-400">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-white hover:text-trust-teal transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
        <div className="lg:mt-64 mt-20 flex flex-col items-center justify-center">
          <h2 className="text-lg text-brand-primary font-manrope ">
            ENGINE COMPONENTS
          </h2>
          <h1 className="font-space-grotesk text-4xl">Core DEFENSE</h1>
        </div>
      </div>
    </>
  );
}
