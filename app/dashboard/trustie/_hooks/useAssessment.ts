import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai"; // 1. Import the new transport
import { useEffect, useRef, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface UseAssessmentChatProps {
  assessmentData: any;
  initialMessages?: any[];
}

export function useAssessmentChat({
  assessmentData,
  initialMessages = [],
}: UseAssessmentChatProps) {
  const router = useRouter();
  const [input, setInput] = useState("");

  const { messages, status, sendMessage, error, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onFinish: () => {
      router.refresh();
    },
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
