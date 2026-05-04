import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ConfirmEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute top-0 right-0 w-96 h-96 bg-trust-blue/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-trust-teal/5 blur-[100px] rounded-full pointer-events-none" />

      <Card className="w-full max-w-md bg-trust-surface/30 backdrop-blur-xl border-trust-border shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500">
        <CardHeader className="text-center pt-10 pb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-trust-blue to-trust-teal rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-trust-blue/20 mx-auto mb-6">
            <Mail className="w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-bold text-white tracking-tight">
            Check your email
          </CardTitle>
          <CardDescription className="text-slate-400 mt-2">
            We&apos;ve sent a verification link to your inbox. Please click it to confirm your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-8">
          <p className="text-sm text-slate-500 leading-relaxed">
            Can&apos;t find the email? Check your spam folder or try to sign in again to resend the link.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pb-10">
          <Link href="/login" className="w-full">
            <Button variant="default" className="w-full gap-2 bg-gradient-to-r from-trust-blue to-trust-teal hover:opacity-90 transition-opacity">
              Back to Login
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
