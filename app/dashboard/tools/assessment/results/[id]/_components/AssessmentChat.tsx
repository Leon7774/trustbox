"use client";

import { useChat } from "@ai-sdk/react";
import { Send, ShieldCheck, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
}: {
  assessmentData: any;
}) {
  const [inputLocal, setInputLocal] = useState("");

  const { messages, isLoading, sendMessage } = useChat({
    api: "/api/chat",
    body: {
      data: { assessmentData },
    },
    // Remove hardcoded static welcome so AI streams instantly.
    initialMessages: [],
  });

  const hasTriggeredInit = useRef(false);

  useEffect(() => {
    if (!hasTriggeredInit.current && messages.length === 0) {
      hasTriggeredInit.current = true;
      if (sendMessage) {
        sendMessage({
          role: "user",
          content: "[INIT_ASSESSMENT]",
        });
      }
    }
  }, [messages.length, sendMessage]);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full flex flex-col flex-1 bg-background">
      {/* Messages */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto w-full scroll-smooth"
      >
        <div className="max-w-4xl mx-auto w-full px-4 md:px-8 py-8 space-y-6">
          {messages
            .filter((m) => m.content !== "[INIT_ASSESSMENT]")
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
          {isLoading && (
            <div className="flex gap-4 mb-6">
              <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center border border-white/10 shadow-sm mt-1 bg-surface">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-center gap-[3px] mt-4 ml-1">
                <span className="w-[5px] h-[5px] bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-[5px] h-[5px] bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-[5px] h-[5px] bg-slate-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Form */}
      <div className="w-full bg-background border-t border-white/10 shrink-0 pt-4 pb-8">
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
            className="w-full bg-surface border border-white/10 rounded-full py-4 pl-6 pr-14 text-[15px] text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-slate-500 shadow-xl"
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
