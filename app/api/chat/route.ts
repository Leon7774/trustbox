import { createGroq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages } from "ai";

const groq = createGroq({
  apiKey: process.env.GROQ_LLM_API,
});
import { retryWithBackoff } from "@/lib/ai-retry";
import { questionsByLevel } from "../../dashboard/tools/assessment/_components/questions";
import { logError } from "@/lib/logger";
import { saveChatSession } from "@/app/actions/chat";

export const maxDuration = 60;

const allQuestions = Object.values(questionsByLevel).flat();

export async function POST(req: Request) {
  const { messages, data } = await req.json();

  // Convert UIMessages (parts-based) to ModelMessages (content-based) for streamText
  const modelMessages = await convertToModelMessages(messages);

  let systemPrompt =
    "You are TrustBox's AI Security Advisor. You act as an expert cybersecurity analyst providing actionable advice. Format your responses with clean spacing and bullet points where useful. Be concise.";

  if (data?.assessmentData) {
    const d = data.assessmentData;
    systemPrompt += `\n\nThe user just completed their cyber assessment. Here are their performance metrics:\n- Overall Risk Score: ${d.totalScore}/100\n- Assessed Risk Level: ${d.riskLevel}\n\n`;

    if (d.rawResponses) {
      systemPrompt +=
        "Here are the specific answers they gave during the assessment. Use these to tailor your advice (0% is high risk, 100% is best practice):\n";
      Object.entries(d.rawResponses as Record<string, number>).forEach(
        ([qId, score]) => {
          const question = allQuestions.find((q) => q.id === qId);
          if (question) {
            systemPrompt += `- Question: "${question.text}" | User Score: ${score}% (Construct: ${question.construct})\n`;
          }
        },
      );
    }

    systemPrompt +=
      "\nHelp them understand these specific vulnerabilities based on their actual behaviors. Address them directly and refer to their specific habits naturally during the conversation. If they have a low score on a specific question, explain why that behavior is risky and how to fix it. Answer any questions they have about improving their security posture.";
  }

  // Check for the INIT_ASSESSMENT trigger in the last message's text content
  const lastMessage = messages[messages.length - 1];
  const lastMessageText =
    lastMessage?.content ||
    lastMessage?.parts?.find((p: any) => p.type === "text")?.text ||
    "";

  if (lastMessageText === "[INIT_ASSESSMENT]") {
    systemPrompt += `\n\nThe UI just securely provided you the scores and raw responses. DO NOT acknowledge the string '[INIT_ASSESSMENT]'. Start the conversation immediately by briefly saying hello and giving them 3 short, personalized, actionable bullet points about how to improve their security based strictly on their lowest scoring behaviors.`;
  }

  const result = await retryWithBackoff(async () => {
    return await streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      messages: modelMessages,
      onFinish: async ({ responseMessages }) => {
        console.log("Stream finished. Starting auto-save...");
        if (data?.assessmentData) {
          console.log("Assessment data received in API:", JSON.stringify(data.assessmentData));
          const { userId, id: assessmentId } = data.assessmentData;

          if (!userId || !assessmentId) {
            console.warn("Missing userId or assessmentId in assessmentData:", data.assessmentData);
            return;
          }

          if (assessmentId === 99999) {
            console.log("Mock assessment 99999 detected. Proceeding to save.");
          }
          // Ensure all messages have ids and consistent format for the client
          const allMessages = [
            ...messages,
            ...responseMessages.map((m) => ({
              ...m,
              id: m.id || Math.random().toString(36).substring(7),
            })),
          ];

          // Generate title if it's the first assistant response
          let title = undefined;
          if (
            messages.length === 1 &&
            (messages[0].content === "[INIT_ASSESSMENT]" ||
              messages[0].parts?.some(
                (p: any) => p.type === "text" && p.text === "[INIT_ASSESSMENT]"
              ))
          ) {
            const firstAssistantMsg = responseMessages.find(
              (m) => m.role === "assistant"
            );
            if (
              firstAssistantMsg &&
              firstAssistantMsg.content &&
              Array.isArray(firstAssistantMsg.content)
            ) {
              const textPart = firstAssistantMsg.content.find(
                (p: any) => p.type === "text"
              );
              if (textPart) {
                title = textPart.text.slice(0, 60).replace(/\n/g, " ") + "...";
              }
            } else if (
              firstAssistantMsg &&
              typeof firstAssistantMsg.content === "string"
            ) {
              title =
                firstAssistantMsg.content.slice(0, 60).replace(/\n/g, " ") +
                "...";
            }
          }

          // We use a try-catch because saveChatSession might fail and we don't want to break the stream
          try {
            console.log(`Auto-saving chat session for assessment: ${assessmentId}, user: ${userId}`);
            
            await saveChatSession({
              userId: Number(userId),
              assessmentId: Number(assessmentId),
              messages: allMessages,
              title,
            });
            console.log("Auto-save successful.");
          } catch (e) {
            console.error("Failed to auto-save chat session:", e);
            await logError({
              action: "AUTO_SAVE_CHAT",
              error: e,
              metadata: { assessmentId, userId, messagesCount: allMessages.length }
            });
          }
        }
      },
    });
  });

  return result.toUIMessageStreamResponse();
}
