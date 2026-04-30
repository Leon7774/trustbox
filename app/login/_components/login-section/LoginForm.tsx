"use client";

import { loginAction } from "@/app/actions/authActions";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginForm() {
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);
    if (result?.error) {
      toast.error(result.error, { position: "top-right" });
      setLoading(false);
    }
  };

  return (
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
  );
}
