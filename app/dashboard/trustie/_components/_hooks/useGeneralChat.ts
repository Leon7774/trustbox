import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState, FormEvent } from "react";

interface UseGeneralChatProps {
  allAssessments: any[];
  initialMessages?: any[];
  userId: number;
}

export function useGeneralChat({
  allAssessments,
  initialMessages = [],
  userId,
}: UseGeneralChatProps) {
  const [input, setInput] = useState("");

  const normalizedInitialMessages = (
    Array.isArray(initialMessages) ? initialMessages : []
  )
    .map((m: any) => {
      const msg = m.message ? m.message : m;
      if (!msg || !msg.role) return null;
      
      let textContent = "";
      if (typeof msg.content === "string") {
        textContent = msg.content;
      } else if (Array.isArray(msg.content)) {
        const textPart = msg.content.find((p: any) => p.type === "text");
        textContent = textPart ? textPart.text : "";
      } else if (Array.isArray(msg.parts)) {
        const textPart = msg.parts.find((p: any) => p.type === "text");
        textContent = textPart ? textPart.text : "";
      }

      if (!textContent) return null;

      return {
        id: msg.id || crypto.randomUUID(),
        role: msg.role as "user" | "assistant" | "system" | "data",
        parts: [{ type: "text" as const, text: textContent }],
      };
    })
    .filter((m) => m !== null) as any[];

  const { messages, status, sendMessage, error, regenerate } = useChat({
    id: `general-${userId}`,
    messages: normalizedInitialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  const getMessageText = (message: any): string => {
    if (message.parts && message.parts.length > 0) {
      return message.parts
        .filter((p: any) => p.type === "text")
        .map((p: any) => p.text)
        .join("");
    }
    return message.content || "";
  };

  const handleSubmit = (e?: FormEvent, customInput?: string) => {
    e?.preventDefault();
    const textToSend = customInput || input;
    if (!textToSend.trim() || isLoading) return;
    
    if (sendMessage) {
      sendMessage(
        { text: textToSend },
        {
          body: {
            data: { allAssessments, userId },
          },
        },
      );
      setInput("");
    }
  };

  const handleRetry = () => {
    if (regenerate) {
      regenerate();
    } else {
      window.location.reload();
    }
  };

  return {
    messages,
    status,
    input,
    setInput,
    isLoading,
    error,
    handleSubmit,
    handleRetry,
    getMessageText,
  };
}
