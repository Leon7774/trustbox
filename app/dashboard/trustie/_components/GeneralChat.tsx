"use client";

import { Send, ShieldCheck, ShieldAlert, BotIcon, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useGeneralChat } from "./_hooks/useGeneralChat";

export default function GeneralChat({
  allAssessments,
  initialMessages = [],
  userId,
  firstName,
}: {
  allAssessments: any[];
  initialMessages?: any[];
  userId: number;
  firstName: string;
}) {
  const {
    messages,
    status,
    input,
    setInput,
    isLoading,
    error,
    handleSubmit,
    handleRetry,
    getMessageText,
  } = useGeneralChat({ allAssessments, initialMessages, userId });

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages, status]);

  if (messages.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-trust-blue to-trust-teal rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-trust-blue/30 mx-auto mb-8 animate-bounce-subtle">
            <BotIcon className="w-10 h-10" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Hello, {firstName}!
          </h1>
          <p className="text-xl text-slate-400 mb-12">
            How can I assist you today with your security posture?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <div className="p-6 bg-surface border border-white/10 rounded-2xl text-left hover:border-trust-blue/50 transition-all">
              <ShieldCheck className="w-6 h-6 text-trust-blue mb-4" />
              <h3 className="text-white font-bold mb-2">Review History</h3>
              <p className="text-sm text-slate-500">
                I can analyze trends across all your {allAssessments.length} assessments.
              </p>
            </div>
            <div className="p-6 bg-surface border border-white/10 rounded-2xl text-left hover:border-trust-blue/50 transition-all">
              <BotIcon className="w-6 h-6 text-trust-teal mb-4" />
              <h3 className="text-white font-bold mb-2">Custom Advice</h3>
              <p className="text-sm text-slate-500">
                Ask me anything about digital safety, phishing, or encryption.
              </p>
            </div>
          </div>
        </div>

        {/* Floating Input Box at the bottom */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-64 p-4 md:p-8 bg-gradient-to-t from-trust-dark via-trust-dark/95 to-transparent z-30">
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="relative flex items-center w-full max-w-4xl mx-auto"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Start a conversation with Trustie..."
              className="w-full h-16 bg-trust-blue/10 hover:bg-trust-blue/20 focus:bg-trust-blue/20 rounded-full py-4 pl-6 pr-14 text-[15px] placeholder:text-slate-500 text-white focus:outline-none border border-white/5 focus:border-trust-blue/30 transition-all shadow-2xl backdrop-blur-md"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-trust-blue hover:bg-trust-blue/90 disabled:opacity-50 text-white rounded-full flex items-center justify-center transition-all shadow-md shadow-trust-blue/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col flex-1 min-h-0 relative">
      <div className="flex-1 overflow-y-auto w-full pb-32">
        <div className="max-w-4xl mx-auto w-full px-4 md:px-8 py-8 space-y-8">
          {messages.map((message, index) => (
            <div
              key={`${message.id}-${index}`}
              className={`flex ${message.role === "user" ? "justify-end" : "gap-4"}`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center border border-white/10 shadow-sm mt-1 bg-surface">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                </div>
              )}

              <div
                className={`text-[15px] leading-relaxed ${
                  message.role === "user"
                    ? "bg-trust-blue/20 text-slate-100 px-5 py-3 rounded-[24px] max-w-[85%] font-medium border border-trust-blue/10"
                    : "text-slate-200 mt-1.5 w-full flex-1 font-light pr-4 prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-trust-dark/50"
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {getMessageText(message)}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex gap-4 animate-in fade-in duration-500">
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

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-500 text-sm font-bold">
                  Advisory System Offline
                </p>
                <p className="text-red-400/80 text-xs mt-1">
                  We&apos;re experiencing heavy traffic. Please try again.
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

      {/* Persistent Input Form */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 p-4 md:p-8 bg-gradient-to-t from-trust-dark via-trust-dark/95 to-transparent z-30">
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="relative flex items-center w-full max-w-4xl mx-auto"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Continue your conversation with Trustie..."
            className="w-full h-16 bg-trust-blue/10 hover:bg-trust-blue/20 focus:bg-trust-blue/20 rounded-full py-4 pl-6 pr-14 text-[15px] placeholder:text-slate-500 text-white focus:outline-none border border-white/5 focus:border-trust-blue/30 transition-all shadow-2xl backdrop-blur-md"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-trust-blue hover:bg-trust-blue/90 disabled:opacity-50 text-white rounded-full flex items-center justify-center transition-all shadow-md shadow-trust-blue/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
