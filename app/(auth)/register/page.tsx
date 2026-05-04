"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, CheckCircle2, RefreshCw } from "lucide-react";
import {
  registerAction,
  resendConfirmationAction,
} from "@/app/actions/authActions";
import { toast } from "sonner";
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
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [resending, setResending] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPasswordError(null);
    const formData = new FormData(e.currentTarget);
    const password = (formData.get("password") as string) || "";
    const confirmPassword = (formData.get("confirmPassword") as string) || "";

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const result = await registerAction(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      setRegisteredEmail(result.email);
      setAlreadyExists(!!result.alreadyExists);
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!registeredEmail) return;
    setResending(true);
    const result = await resendConfirmationAction(registeredEmail);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Confirmation email resent!");
    }
    setResending(false);
  };

  return (
    <div className="flex items-center justify-center mt-20 px-4 mb-20">
      <Card className="w-full max-w-md border-white/10 bg-surface/80 backdrop-blur-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Secure your account to start your TrustBox journey
          </CardDescription>
        </CardHeader>
        {registeredEmail ? (
          <div className="p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-trust-blue)] to-[var(--color-trust-teal)] rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-trust-blue/20 mx-auto mb-6">
              <Mail className="w-10 h-10" />
            </div>
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-3xl font-bold">
                {alreadyExists ? "Account Exists" : "Check your inbox"}
              </CardTitle>
              <CardDescription className="text-lg mt-2 px-4">
                {alreadyExists
                  ? "This email is already registered in our system."
                  : "Check your inbox to confirm your email."}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 mb-8">
              <div className="flex items-center justify-center gap-2 text-[var(--color-trust-blue)] bg-[var(--color-trust-blue)]/10 py-3 px-4 rounded-xl border border-[var(--color-trust-blue)]/20 mx-4">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium break-all">
                  Sent to {registeredEmail}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-6 px-6 leading-relaxed">
                {alreadyExists
                  ? "If you haven't confirmed your email yet, click below to resend the verification link. Otherwise, please sign in."
                  : "We've sent a verification link to your email. Please click it to activate your account."}
              </p>
            </CardContent>
            <CardFooter className="p-0 flex flex-col gap-3">
              {alreadyExists && (
                <Button
                  variant="outline"
                  className="w-full gap-2 border-[var(--color-trust-blue)]/20 hover:bg-[var(--color-trust-blue)]/5"
                  onClick={handleResend}
                  disabled={resending}
                >
                  <RefreshCw
                    className={cn("w-4 h-4", resending && "animate-spin")}
                  />
                  {resending ? "Resending..." : "Resend Confirmation Link"}
                </Button>
              )}
              <Button asChild className="w-full">
                <Link href="/login">
                  {alreadyExists ? "Sign In" : "Back to Sign In"}
                </Link>
              </Button>
            </CardFooter>
          </div>
        ) : (
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                />
                <p className="text-xs text-slate-500">
                  Use at least 8 characters.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                />
              </div>
              {passwordError && (
                <div className="text-red-400 text-sm">{passwordError}</div>
              )}
              {error && <div className="text-red-400 text-sm">{error}</div>}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
              <div className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[var(--color-trust-blue)] hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
