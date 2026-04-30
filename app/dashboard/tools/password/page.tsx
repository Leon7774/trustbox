import { Key } from "lucide-react";
import PasswordChecker from "@/app/dashboard/tools/password/components/PasswordChecker";
import Link from "next/link";

export default function PasswordCheckerPage() {
  return (
    <div className="w-full max-w-3xl flex flex-col items-center animate-in fade-in duration-700">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/20 flex items-center justify-center text-secondary mb-6">
        <Key className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-bold text-white mb-2 text-center text-balance">
        Password Strength Analyzer
      </h1>
      <p className="text-slate-400 mb-10 text-center max-w-xl text-balance">
        Test your password strength locally. Your input never leaves your device
        and is not saved on our servers.
      </p>

      <div className="w-full bg-surface border border-border rounded-xl p-8 backdrop-blur-xl shadow-2xl">
        <PasswordChecker />
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="text-secondary hover:text-secondary-glow transition-colors text-sm"
        >
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
