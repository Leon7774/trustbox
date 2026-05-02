"use client";

import { useState } from "react";
import {
  Search,
  Link as LinkIcon,
  ExternalLink,
  AlertTriangle,
  Info,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import { checkUrlReputationAction } from "@/app/actions/url";

interface UrlAnalysis {
  url: string;
  isHttps: boolean;
  hasSuspiciousKeywords: boolean;
  hasIpAddress: boolean;
  isShortened: boolean;
  domainLength: number;
  mockReputation: "Safe" | "Suspicious" | "Malicious" | "Unknown";
  score: number; // 0-100
  officialReputation?: "Safe" | "Dangerous";
  threatType?: string | null;
}

export default function UrlChecker() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<UrlAnalysis | null>(null);

  const analyzeUrl = async (inputUrl: string) => {
    setIsAnalyzing(true);
    setAnalysis(null);

    let parsedUrl: URL;
    try {
      const toParse = inputUrl.match(/^https?:\/\//)
        ? inputUrl
        : `https://${inputUrl}`;
      parsedUrl = new URL(toParse);
    } catch (e) {
      setIsAnalyzing(false);
      return;
    }

    const domain = parsedUrl.hostname;
    const isHttps = parsedUrl.protocol === "https:";
    const hasIpAddress = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(domain);

    const suspiciousKeywords = [
      "login",
      "verify",
      "update",
      "secure",
      "bank",
      "account",
      "free",
      "admin",
    ];
    const hasSuspiciousKeywords = suspiciousKeywords.some((kw) =>
      inputUrl.toLowerCase().includes(kw),
    );

    const shorteners = ["bit.ly", "t.co", "tinyurl", "ow.ly", "is.gd"];
    const isShortened = shorteners.some((sh) => domain.includes(sh));

    let structuralScore = 100;
    if (!isHttps) structuralScore -= 40;
    if (hasIpAddress) structuralScore -= 50;
    if (hasSuspiciousKeywords) structuralScore -= 30;
    if (isShortened) structuralScore -= 20;
    if (domain.length > 30) structuralScore -= 15;
    structuralScore = Math.max(0, structuralScore);

    // Call Google Safe Browsing API
    const reputationResult = await checkUrlReputationAction(inputUrl);

    let finalScore = structuralScore;
    let officialReputation: "Safe" | "Dangerous" = "Safe";
    let threatType = null;

    if (reputationResult.success) {
      if (reputationResult.isDangerous) {
        officialReputation = "Dangerous";
        threatType = reputationResult.threatType;
        finalScore = Math.min(10, finalScore); // Tank the score if Google flags it
      }
    }

    let mockReputation: UrlAnalysis["mockReputation"] = "Unknown";
    if (finalScore >= 80) mockReputation = "Safe";
    else if (finalScore >= 40) mockReputation = "Suspicious";
    else mockReputation = "Malicious";

    setAnalysis({
      url: inputUrl,
      isHttps,
      hasSuspiciousKeywords,
      hasIpAddress,
      isShortened,
      domainLength: domain.length,
      mockReputation,
      score: finalScore,
      officialReputation,
      threatType,
    });
    setIsAnalyzing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && url) {
      analyzeUrl(url);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-slate-500">
          <LinkIcon className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a URL (e.g., example.com)"
          className="w-full bg-background/50 border border-border rounded-xl pl-12 pr-32 py-4 text-lg text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all font-mono"
        />
        <button
          onClick={() => url && analyzeUrl(url)}
          disabled={!url || isAnalyzing}
          className="absolute right-2 px-6 py-2 bg-accent-dark hover:bg-accent text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isAnalyzing ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <span>Scan</span>
          )}
        </button>
      </div>

      {analysis && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-background/30 rounded-xl p-6 border border-border/50 flex flex-col md:flex-row gap-6 items-center justify-between relative overflow-hidden">
            {/* Status Background Glow */}
            <div
              className={`absolute top-0 right-0 w-64 h-64 blur-3xl rounded-full opacity-10 pointer-events-none ${
                analysis.score >= 80
                  ? "bg-secondary"
                  : analysis.score >= 40
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
            />

            <div className="flex items-center gap-6 z-10 w-full md:w-auto">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    className="text-background"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="48"
                    cy="48"
                  />
                  <circle
                    className={`transition-all duration-1000 ${
                      analysis.score >= 80
                        ? "text-secondary"
                        : analysis.score >= 40
                          ? "text-yellow-500"
                          : "text-red-500"
                    }`}
                    strokeWidth="8"
                    strokeDasharray={251.2} /* 2 * PI * 40 */
                    strokeDashoffset={251.2 - (251.2 * analysis.score) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="48"
                    cy="48"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-white font-bold text-xl">
                  {analysis.score}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {analysis.mockReputation} URL
                </h3>
                <p
                  className="text-slate-400 text-sm max-w-[280px] truncate"
                  title={analysis.url}
                >
                  {analysis.url}
                </p>
              </div>
            </div>

            <div className="z-10 w-full md:w-auto flex-1 flex justify-end">
              {analysis.score >= 80 ? (
                <div className="flex items-center gap-2 text-secondary bg-trust-blue px-4 py-2 rounded-lg border border-secondary/20">
                  <ShieldCheck className="w-5 h-5" color="white" />
                  <span className="font-medium text-foreground">
                    Safe to Browse
                  </span>
                </div>
              ) : analysis.score >= 40 ? (
                <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 px-4 py-2 rounded-lg border border-yellow-500/20">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">Proceed with Caution</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-500 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                  <ShieldAlert className="w-5 h-5" />
                  <span className="font-medium">Malicious Risk</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-background/30 rounded-xl border border-border/50 overflow-hidden">
            <div className="p-4 border-b border-border/50 bg-surface flex items-center justify-between">
              <h3 className="text-white text-sm font-semibold">
                Official Reputation (Google)
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-trust-teal animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  Live Database Check
                </span>
              </div>
            </div>
            <div className="p-6 flex flex-col md:flex-row items-center gap-6">
              <div
                className={`p-4 rounded-full ${
                  analysis.officialReputation === "Safe"
                    ? "bg-secondary/10 text-secondary"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {analysis.officialReputation === "Safe" ? (
                  <ShieldCheck className="w-10 h-10 text-trust-blue" />
                ) : (
                  <ShieldAlert className="w-10 h-10 text-red-400" />
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-white font-bold text-lg mb-1">
                  {analysis.officialReputation === "Safe"
                    ? "Verified Safe"
                    : "Dangerous URL Detected"}
                </h4>
                <p className="text-slate-400 text-sm">
                  {analysis.officialReputation === "Safe"
                    ? "Google Safe Browsing did not find this URL in its database of malicious sites."
                    : `This URL is flagged as ${analysis.threatType?.replace(/_/g, " ").toLowerCase() || "malicious"} by Google.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
