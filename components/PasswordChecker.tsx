"use client";

import { useState, useEffect } from "react";
import zxcvbn from "zxcvbn";
import { Check, X, ShieldAlert, ShieldCheck, Info } from "lucide-react";

export default function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<zxcvbn.ZXCVBNResult | null>(null);

  useEffect(() => {
    if (password) {
      setResult(zxcvbn(password));
    } else {
      setResult(null);
    }
  }, [password]);

  const scoreColors = [
    "bg-red-500",    // 0: Very Weak
    "bg-orange-500", // 1: Weak
    "bg-yellow-500", // 2: Fair
    "bg-trust-teal", // 3: Strong
    "bg-trust-blue", // 4: Very Strong
  ];

  const scoreLabels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];

  // Calculate generic entropy stats
  const lengthScore = password.length >= 12 ? true : false;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="relative">
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type a password to test..."
          className="w-full bg-trust-dark/50 border border-trust-border rounded-xl px-4 py-4 text-lg text-white focus:outline-none focus:ring-2 focus:ring-trust-teal/50 focus:border-trust-teal transition-all"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
          {password.length} chars
        </div>
      </div>

      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Main Score Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-white font-medium text-lg">Overall Strength</span>
              <span className={`font-semibold ${result.score >= 3 ? "text-trust-teal" : "text-orange-400"}`}>
                {scoreLabels[result.score]}
              </span>
            </div>
            <div className="h-3 w-full bg-trust-dark rounded-full overflow-hidden flex gap-1">
              {[0, 1, 2, 3].map((segment) => (
                <div
                  key={segment}
                  className={`h-full flex-1 rounded-full transition-all duration-500 ${
                    segment < (result.score || (password ? 1 : 0)) // if score 0 but has pass, show 1 bar red
                      ? scoreColors[result.score]
                      : "bg-transparent"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Feedback details */}
            <div className="bg-trust-dark/30 rounded-lg p-5 border border-trust-border/50">
              <h3 className="text-white text-sm font-semibold mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-trust-blue" />
                Analysis Feedback
              </h3>
              {result.feedback.warning ? (
                <div className="flex items-start gap-2 text-orange-400 text-sm mb-3">
                  <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>{result.feedback.warning}</p>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-trust-teal text-sm mb-3">
                  <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>No major vulnerabilities detected in patterns.</p>
                </div>
              )}
              {result.feedback.suggestions.length > 0 && (
                <ul className="text-slate-400 text-sm space-y-1 pl-6 list-disc">
                  {result.feedback.suggestions.map((sug, i) => (
                    <li key={i}>{sug}</li>
                  ))}
                </ul>
              )}
              {result.feedback.suggestions.length === 0 && !result.feedback.warning && (
                <p className="text-slate-400 text-sm pl-6">Your password is robust against dictionary algorithms!</p>
              )}
            </div>

            {/* Constraints Checklist */}
            <div className="bg-trust-dark/30 rounded-lg p-5 border border-trust-border/50">
              <h3 className="text-white text-sm font-semibold mb-4">Composition Metrics</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm">
                  {lengthScore ? <Check className="w-4 h-4 text-trust-teal" /> : <X className="w-4 h-4 text-slate-600" />}
                  <span className={lengthScore ? "text-slate-200" : "text-slate-500"}>12+ Characters ({password.length})</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  {hasUpper ? <Check className="w-4 h-4 text-trust-teal" /> : <X className="w-4 h-4 text-slate-600" />}
                  <span className={hasUpper ? "text-slate-200" : "text-slate-500"}>Uppercase Letter</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  {hasLower ? <Check className="w-4 h-4 text-trust-teal" /> : <X className="w-4 h-4 text-slate-600" />}
                  <span className={hasLower ? "text-slate-200" : "text-slate-500"}>Lowercase Letter</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  {hasNumber ? <Check className="w-4 h-4 text-trust-teal" /> : <X className="w-4 h-4 text-slate-600" />}
                  <span className={hasNumber ? "text-slate-200" : "text-slate-500"}>Number</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  {hasSymbol ? <Check className="w-4 h-4 text-trust-teal" /> : <X className="w-4 h-4 text-slate-600" />}
                  <span className={hasSymbol ? "text-slate-200" : "text-slate-500"}>Special Character</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center text-xs text-slate-500 pt-4 border-t border-trust-border/50">
            Estimated time to crack: <span className="text-slate-300 font-mono">{result.crack_times_display.offline_slow_hashing_1e4_per_second}</span>
          </div>
        </div>
      )}
    </div>
  );
}
