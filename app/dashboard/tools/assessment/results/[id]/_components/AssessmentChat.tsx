"use client";

import { useChat } from "@ai-sdk/react";
import { Send, ShieldCheck, User, ShieldAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const parseBold = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-white/90">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

const parseMarkdown = (text: string) => {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.trim().startsWith("*")) {
      const content = parseBold(line.replace(/^\*\s*/, ""));
      return (
        <li key={i} className="ml-5 list-disc mt-2 text-slate-200/90">
          {content}
        </li>
      );
    }
    if (line.trim() === "") return <div key={i} className="h-3" />;
    return (
      <p key={i} className="mt-1">
        {parseBold(line)}
      </p>
    );
  });
};

export default function AssessmentChat({
  assessmentData,
  initialMessages = [],
}: {
  assessmentData: any;
  initialMessages?: any[];
}) {
  const [inputLocal, setInputLocal] = useState("");

  const router = useRouter();
  const { messages, status, sendMessage, error, regenerate } = useChat({
    api: "/api/chat",
    body: {
      data: { assessmentData },
    },
    initialMessages,
    onFinish: () => {
      router.refresh();
    },
  });

  // Derive a simple loading flag from the SDK status
  const isLoading = status === "submitted" || status === "streaming";

  const hasTriggeredInit = useRef(false);

  useEffect(() => {
    if (!hasTriggeredInit.current && messages.length === 0) {
      hasTriggeredInit.current = true;
      if (sendMessage) {
        sendMessage({
          text: "[INIT_ASSESSMENT]",
        });
      }
    }
  }, [messages.length, sendMessage]);

  const chatRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or during streaming
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  // Helper to extract text content from a message (handles both parts-based and content-based)
  const getMessageText = (message: any): string => {
    if (message.parts && message.parts.length > 0) {
      return message.parts
        .filter((p: any) => p.type === "text")
        .map((p: any) => p.text)
        .join("");
    }
    return message.content || "";
  };

  return (
    <div className="w-full h-full flex flex-col flex-1 min-h-0 relative">
      {/* Messages */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto w-full scroll-smooth pb-4" // Added pb-4 so bottom messages don't hug the input tight
      >
        <div className="max-w-4xl mx-auto w-full px-4 md:px-8 py-8 space-y-6">
          {messages
            .filter((m) => getMessageText(m) !== "[INIT_ASSESSMENT]")
            .map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end mb-6" : "gap-4 mb-6"}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center border border-white/10 shadow-sm mt-1 bg-surface">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                  </div>
                )}

                <div
                  className={`text-[15px] leading-relaxed whitespace-pre-wrap ${
                    message.role === "user"
                      ? "bg-[#2f2f2f] text-slate-100 px-5 py-3 rounded-[24px] max-w-[85%] font-medium shadow-sm"
                      : "text-slate-200 mt-1.5 w-full flex-1 font-light pr-4"
                  }`}
                >
                  <div className="space-y-1">
                    {message.parts && message.parts.length > 0
                      ? message.parts.map((part: any, i: number) => {
                          if (part.type === "text")
                            return (
                              <div key={i}>{parseMarkdown(part.text)}</div>
                            );
                          return null;
                        })
                      : parseMarkdown(message.content)}
                  </div>
                </div>
              </div>
            ))}
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
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 mb-6">
              <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-500 text-sm font-bold">
                  Advisory System Offline
                </p>
                <p className="text-red-400/80 text-xs mt-1">
                  We&apos;re experiencing heavy traffic or a quota limit. Please
                  try again in a moment.
                </p>
                <button
                  onClick={() =>
                    regenerate ? regenerate() : window.location.reload()
                  }
                  className="text-red-400 underline mt-2 text-xs font-medium hover:text-red-300 transition-colors"
                >
                  Retry Analysis
                </button>
              </div>
            </div>
          )}
          <div ref={bottomRef} className="h-4" />{" "}
        </div>
      </div>

      {/* Input Form */}
      <div className="w-full shrink-0 border-t border-white/10 pt-4 pb-8 bg-background z-20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!inputLocal.trim() || isLoading) return;
            if (sendMessage) {
              sendMessage({ text: inputLocal });
              setInputLocal("");
            }
          }}
          className="relative flex items-center w-full max-w-4xl mx-auto px-4 md:px-8"
        >
          <input
            value={inputLocal}
            onChange={(e) => setInputLocal(e.currentTarget.value)}
            placeholder="Ask a question about your security posture or how to improve it..."
            className="w-full h-16 bg-trust-blue/20 rounded-full py-4 pl-6 pr-14 text-[15px] placeholder:text-foreground/80 text-white focus:outline-none border-none transition-colors shadow-xl"
          />
          <button
            type="submit"
            disabled={!inputLocal.trim() || isLoading}
            className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 disabled:hover:bg-brand-primary text-black rounded-full flex items-center justify-center transition-all shadow-md"
          >
            <Send className="w-4 h-4 -ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
