"use client";

import { useState } from "react";
import { Lock, CheckCircle2 } from "lucide-react";
import { updatePasswordAction } from "@/app/actions/authActions";
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

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setPasswordError(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    const result = await updatePasswordAction(formData);
    
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    }
    // Success will redirect via the action
  };

  return (
    <div className="flex items-center justify-center mt-20 px-4">
      <Card className="w-full max-w-md border-white/10 bg-surface/80 backdrop-blur-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Set New Password
          </CardTitle>
          <CardDescription className="text-center">
            Choose a strong password to secure your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdate}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                className="bg-trust-dark/60 border-trust-border/60 focus:border-trust-teal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="bg-trust-dark/60 border-trust-border/60 focus:border-trust-teal"
              />
            </div>
            {passwordError && (
              <div className="text-red-400 text-sm">{passwordError}</div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
              {!loading && <Lock className="w-4 h-4" />}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
