import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai"; // 1. Import the new transport
import { useEffect, useRef, useState, FormEvent } from "react";

interface UseAssessmentChatProps {
  assessmentData: any;
  initialMessages?: any[] | string;
}

export function useAssessmentChat({
  assessmentData,
  initialMessages = [],
}: UseAssessmentChatProps) {
  const [input, setInput] = useState("");

  // 1. Sanitize the Supabase JSONB payload into strict UI Messages
  const parsedInitialMessages =
    typeof initialMessages === "string"
      ? (() => {
          try {
            return JSON.parse(initialMessages);
          } catch {
            return [];
          }
        })()
      : initialMessages;

  const normalizedInitialMessages = (
    Array.isArray(parsedInitialMessages) ? parsedInitialMessages : []
  )
    .map((m: any) => {
      // If Vercel saved the giant finish event object, dig out the actual message
      const msg = m.message ? m.message : m;

      // If it's still missing core properties, or it's a "streaming" artifact, drop it
      if (!msg || !msg.role) return null;
      if (msg.parts?.some((p: any) => p.state === "streaming")) return null;

      // Extract the text safely from the parts array
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
        id: msg.id || Math.random().toString(36).substring(7),
        role: msg.role,
        parts: [{ type: "text", text: textContent }],
      };
    })
    .filter((m) => m !== null) // Nuke the nulls
    .map((m, index, arr) => {
      const duplicateCount = arr
        .slice(0, index)
        .filter((prev) => prev.id === m.id).length;

      if (duplicateCount === 0) return m;

      return {
        ...m,
        id: `${m.id}-${duplicateCount}`,
      };
    });

  // 2. Pass the sanitized array to useChat
  const { messages, status, sendMessage, error, regenerate } = useChat({
    id: assessmentData.id.toString(), // Keep this!
    messages: normalizedInitialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";
  const hasTriggeredInit = useRef(false);

  // 3. Auto-trigger initial message
  useEffect(() => {
    if (!hasTriggeredInit.current && messages.length === 0) {
      hasTriggeredInit.current = true;
      if (sendMessage) {
        // 4. Attach the body payload explicitly to the request
        sendMessage(
          { text: "[INIT_ASSESSMENT]" },
          {
            body: {
              data: { assessmentData },
            },
          },
        );
      }
    }
  }, [messages.length, sendMessage, assessmentData]);

  // Helper to extract text from multi-part or standard messages
  const getMessageText = (message: any): string => {
    if (message.parts && message.parts.length > 0) {
      return message.parts
        .filter((p: any) => p.type === "text")
        .map((p: any) => p.text)
        .join("");
    }
    return message.content || "";
  };

  // Filter out the ugly backend prompt so the UI never sees it
  const visibleMessages = messages.filter(
    (m) => getMessageText(m) !== "[INIT_ASSESSMENT]",
  );

  // Clean form handler
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    if (sendMessage) {
      // 5. Attach the body payload to user messages as well
      sendMessage(
        { text: input },
        {
          body: {
            data: { assessmentData },
          },
        },
      );
      setInput("");
    }
  };

  // Clean retry handler
  const handleRetry = () => {
    if (regenerate) {
      regenerate();
    } else {
      window.location.reload();
    }
  };

  return {
    messages: visibleMessages,
    rawMessages: messages,
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
