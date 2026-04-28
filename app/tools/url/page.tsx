import { Link as LinkIcon } from "lucide-react";
import UrlChecker from "@/app/tools/url/components/UrlChecker";
import Link from "next/link";

export default function UrlCheckerPage() {
  return (
    <div className="w-full max-w-3xl flex flex-col items-center animate-in fade-in duration-700">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center text-accent mb-6">
        <LinkIcon className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-bold text-white mb-2 text-center text-balance">
        URL Safety Analyzer
      </h1>
      <p className="text-slate-400 mb-10 text-center max-w-xl text-balance">
        Scan links for structural anomalies, malicious patterns, and potential
        phishing indicators.
      </p>

      <div className="w-full bg-surface border border-border rounded-xl p-8 backdrop-blur-xl shadow-2xl">
        <UrlChecker />
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="text-accent hover:text-indigo-300 transition-colors text-sm"
        >
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
