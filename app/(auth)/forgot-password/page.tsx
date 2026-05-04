"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { forgotPasswordAction } from "@/app/actions/authActions";
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

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleForgot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await forgotPasswordAction(formData);
    
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      setSubmitted(true);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center mt-20 px-4">
      <Card className="w-full max-w-md border-white/10 bg-surface/80 backdrop-blur-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/login" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <CardTitle className="text-2xl font-bold">
              Reset Password
            </CardTitle>
          </div>
          <CardDescription>
            {submitted 
              ? "Check your email for a link to reset your password." 
              : "Enter your email address and we'll send you a link to reset your password."}
          </CardDescription>
        </CardHeader>
        {submitted ? (
          <CardContent className="space-y-4 py-6 text-center">
            <div className="w-16 h-16 bg-trust-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-trust-blue/20">
              <Mail className="w-8 h-8 text-trust-blue" />
            </div>
            <p className="text-slate-300">
              We&apos;ve sent a reset link to <span className="text-white font-medium">{email}</span>
            </p>
            <Button asChild variant="outline" className="w-full mt-4">
              <Link href="/login">Back to Login</Link>
            </Button>
          </CardContent>
        ) : (
          <form onSubmit={handleForgot}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-trust-dark/60 border-trust-border/60 focus:border-trust-teal"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
                {!loading && <Send className="w-4 h-4" />}
              </Button>
              <div className="text-center text-sm text-gray-400">
                Remembered your password?{" "}
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
