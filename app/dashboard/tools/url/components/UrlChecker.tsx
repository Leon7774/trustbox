"use client";

import { useState } from "react";
import { Search, ShieldAlert, ShieldCheck, AlertTriangle, Link as LinkIcon, ExternalLink } from "lucide-react";

interface UrlAnalysis {
  url: string;
  isHttps: boolean;
  hasSuspiciousKeywords: boolean;
  hasIpAddress: boolean;
  isShortened: boolean;
  domainLength: number;
  mockReputation: "Safe" | "Suspicious" | "Malicious" | "Unknown";
  score: number; // 0-100
}

export default function UrlChecker() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<UrlAnalysis | null>(null);

  const analyzeUrl = (inputUrl: string) => {
    setIsAnalyzing(true);
    setAnalysis(null);

    // Simulate network delay for effect
    setTimeout(() => {
      let parsedUrl: URL;
      try {
        // Prepend https if no protocol
        const toParse = inputUrl.match(/^https?:\/\//) ? inputUrl : `https://${inputUrl}`;
        parsedUrl = new URL(toParse);
      } catch (e) {
        setIsAnalyzing(false);
        return; // Invalid URL
      }

      const domain = parsedUrl.hostname;
      const isHttps = parsedUrl.protocol === "https:";
      const hasIpAddress = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(domain);
      
      const suspiciousKeywords = ["login", "verify", "update", "secure", "bank", "account", "free", "admin"];
      const hasSuspiciousKeywords = suspiciousKeywords.some(kw => inputUrl.toLowerCase().includes(kw));
      
      const shorteners = ["bit.ly", "t.co", "tinyurl", "ow.ly", "is.gd"];
      const isShortened = shorteners.some(sh => domain.includes(sh));

      let score = 100;
      if (!isHttps) score -= 40;
      if (hasIpAddress) score -= 50;
      if (hasSuspiciousKeywords) score -= 30;
      if (isShortened) score -= 20;
      if (domain.length > 30) score -= 15;

      score = Math.max(0, score);
      
      let mockReputation: UrlAnalysis["mockReputation"] = "Unknown";
      if (score >= 80) mockReputation = "Safe";
      else if (score >= 40) mockReputation = "Suspicious";
      else mockReputation = "Malicious";

      setAnalysis({
        url: inputUrl,
        isHttps,
        hasSuspiciousKeywords,
        hasIpAddress,
        isShortened,
        domainLength: domain.length,
        mockReputation,
        score
      });
      setIsAnalyzing(false);
    }, 1500);
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
            <div className={`absolute top-0 right-0 w-64 h-64 blur-3xl rounded-full opacity-10 pointer-events-none ${
              analysis.score >= 80 ? "bg-secondary" : analysis.score >= 40 ? "bg-yellow-500" : "bg-red-500"
            }`} />
            
            <div className="flex items-center gap-6 z-10 w-full md:w-auto">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-background" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48" />
                  <circle
                    className={`transition-all duration-1000 ${
                      analysis.score >= 80 ? "text-secondary" : analysis.score >= 40 ? "text-yellow-500" : "text-red-500"
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
                <p className="text-slate-400 text-sm max-w-[280px] truncate" title={analysis.url}>
                  {analysis.url}
                </p>
              </div>
            </div>

            <div className="z-10 w-full md:w-auto flex-1 flex justify-end">
              {analysis.score >= 80 ? (
                <div className="flex items-center gap-2 text-secondary bg-secondary/10 px-4 py-2 rounded-lg border border-secondary/20">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="font-medium">Safe to Browse</span>
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
            <div className="p-4 border-b border-border/50 bg-surface hidden md:flex">
              <h3 className="text-white text-sm font-semibold">Structural Analysis</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/50">
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-slate-300 text-sm font-medium block">Connection Security</span>
                    <span className="text-slate-500 text-xs">Uses HTTPS encryption</span>
                  </div>
                  {analysis.isHttps ? (
                    <span className="px-2 py-1 bg-secondary/20 text-secondary text-xs rounded border border-secondary/30">Secure</span>
                  ) : (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded border border-red-500/30">Insecure (HTTP)</span>
                  )}
                </div>
                
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-slate-300 text-sm font-medium block">Target Domain</span>
                    <span className="text-slate-500 text-xs">IP address instead of domain</span>
                  </div>
                  {analysis.hasIpAddress ? (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded border border-red-500/30">IP Detected</span>
                  ) : (
                    <span className="px-2 py-1 bg-surface text-slate-400 text-xs rounded border border-border">Valid Domain</span>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-slate-300 text-sm font-medium block">Suspicious Keywords</span>
                    <span className="text-slate-500 text-xs">Words often used in phishing</span>
                  </div>
                  {analysis.hasSuspiciousKeywords ? (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded border border-yellow-500/30">Flagged</span>
                  ) : (
                    <span className="px-2 py-1 bg-surface text-slate-400 text-xs rounded border border-border">Clean</span>
                  )}
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-slate-300 text-sm font-medium block">Link Shorteners</span>
                    <span className="text-slate-500 text-xs">Masks the true destination</span>
                  </div>
                  {analysis.isShortened ? (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded border border-yellow-500/30">Shortened</span>
                  ) : (
                    <span className="px-2 py-1 bg-surface text-slate-400 text-xs rounded border border-border">Direct</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
