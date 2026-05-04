"use client";

import { Send, ShieldCheck, ShieldAlert } from "lucide-react";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAssessmentChat } from "./_hooks/useAssessment";

export default function AssessmentChat({
  assessmentData,
  initialMessages = [],
}: {
  assessmentData: any;
  initialMessages?: any[];
}) {
  // 1. Pull all the logic from your shiny new hook
  const {
    messages,
    rawMessages,
    status,
    input,
    setInput,
    isLoading,
    error,
    handleSubmit,
    handleRetry,
    getMessageText,
  } = useAssessmentChat({ assessmentData, initialMessages });

  // 2. Keep the purely UI-focused scroll logic here
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [rawMessages, status]);

  return (
    <div className="w-full h-full flex flex-col flex-1 min-h-0 relative">
      <div className="flex-1 overflow-y-auto w-full pb-4">
        <div className="max-w-4xl mx-auto w-full px-4 md:px-8 py-8 space-y-6">
          {messages.map((message, index) => (
            <div
              key={`${message.id}-${index}`}
              className={`flex ${message.role === "user" ? "justify-end mb-6" : "gap-4 mb-6"}`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center border border-white/10 shadow-sm mt-1 bg-surface">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                </div>
              )}

              <div
                className={`text-[15px] leading-relaxed ${
                  message.role === "user"
                    ? "bg-[#2f2f2f] text-slate-100 px-5 py-3 rounded-[24px] max-w-[85%] font-medium shadow-sm whitespace-pre-wrap"
                    : "text-slate-200 mt-1.5 w-full flex-1 font-light pr-4 prose prose-invert max-w-none"
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {getMessageText(message)}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {/* Loading Skeleton */}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex gap-4 mb-6 animate-in fade-in duration-500">
              <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center border border-white/10 shadow-sm mt-1 bg-surface">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 space-y-3 mt-2 pr-12">
                <div className="h-3 bg-white/15 rounded-full w-full animate-pulse shadow-inner" />
                <div className="h-3 bg-white/15 rounded-full w-[90%] animate-pulse [animation-delay:200ms]" />
                <div className="h-3 bg-white/15 rounded-full w-[75%] animate-pulse [animation-delay:400ms]" />
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 mb-6">
              <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-500 text-sm font-bold">
                  Advisory System Offline
                </p>
                <p className="text-red-400/80 text-xs mt-1">
                  We&apos;re experiencing heavy traffic or a quota limit. Please
                  try again.
                </p>
                <button
                  onClick={handleRetry}
                  className="text-red-400 underline mt-2 text-xs font-medium hover:text-red-300 transition-colors"
                >
                  Retry Analysis
                </button>
              </div>
            </div>
          )}
          <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      {/* Input Form */}
      <div className="w-full shrink-0 border-t border-white/10 pt-4 pb-8 z-20">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center w-full max-w-4xl mx-auto px-4 md:px-8"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your security posture or how to improve it..."
            className="w-full h-16 bg-trust-blue/20 rounded-full py-4 pl-6 pr-14 text-[15px] placeholder:text-foreground/80 text-white focus:outline-none border-none transition-colors shadow-xl"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 disabled:hover:bg-brand-primary text-black rounded-full flex items-center justify-center transition-all shadow-md"
          >
            <Send className="w-4 h-4 -ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
