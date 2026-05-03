import { createGroq } from "@ai-sdk/groq";

import { streamText, convertToModelMessages } from "ai";

import { retryWithBackoff } from "@/lib/ai-retry";

import { questionsByLevel } from "../../dashboard/tools/assessment/_components/questions";

import { logError } from "@/lib/logger";

import { upsertChatSession } from "@/lib/chat-db";

const groq = createGroq({
  apiKey: process.env.GROQ_LLM_API,
});

export const maxDuration = 60;

const allQuestions = Object.values(questionsByLevel).flat();

export async function POST(req: Request) {
  const { messages, data } = await req.json();

  // Convert UIMessages (parts-based) to ModelMessages (content-based) for streamText

  const modelMessages = await convertToModelMessages(messages);

  // 1. Define the core persona and constraints

  let systemPrompt = `You are Trustie, TrustBox's AI Security Advisor. You are an expert cybersecurity analyst.

Your tone must be professional, empathetic, and concise.


STRICT CONSTRAINTS:

- NEVER break character.

- Keep responses under 150 words unless explaining a complex technical concept.

- Always format actionable advice using markdown bullet points.

- NEVER patronize the user. Be realistic about their risks and supportive about their improvements.`;

  // 2. Inject Context using Data Delimiters

  if (data?.assessmentData) {
    const d = data.assessmentData;

    systemPrompt += `\n\n<user_security_profile>\n`;

    systemPrompt += `- Overall Risk Score: ${d.totalScore}/100\n`;

    systemPrompt += `- Assessed Risk Level: ${d.riskLevel}\n`;

    if (d.rawResponses) {
      systemPrompt += `\n<assessment_answers>\n`;

      Object.entries(d.rawResponses as Record<string, number>).forEach(
        ([qId, score]) => {
          const question = allQuestions.find((q) => q.id === qId);

          if (question) {
            systemPrompt += `- [Construct: ${question.construct}] "${question.text}" | Score: ${score}% (Note: 0% = High Risk, 100% = Secure)\n`;
          }
        },
      );

      systemPrompt += `</assessment_answers>\n`;
    }

    systemPrompt += `</user_security_profile>\n\n`;

    // 3. Define the specific task behavior

    systemPrompt += `YOUR MISSION:

Analyze the <user_security_profile>. Address the user directly about their specific vulnerabilities. If they scored low on a specific behavior, explain *why* it's risky and provide exact steps to fix it.`;
  }

  // 4. Check for the initialization trigger safely

  const lastMessage = messages[messages.length - 1];

  const lastMessageText =
    lastMessage?.content ||
    lastMessage?.parts?.find((p: any) => p.type === "text")?.text ||
    "";

  if (lastMessageText === "[INIT_ASSESSMENT]") {
    systemPrompt += `\n\nSYSTEM EVENT: THE USER HAS JUST LAUNCHED THE CHATBOX.

Do not wait for a prompt. Immediately greet the user (e.g., "Hi, I'm Trustie...") and provide exactly 3 highly personalized, actionable bullet points on how to improve their security posture, targeting ONLY their lowest-scoring behaviors from the data above.`;
  }

  // 5. Stream Generation and Database Auto-Save

  const result = await retryWithBackoff(async () => {
    return await streamText({
      model: groq("llama-3.3-70b-versatile"),

      system: systemPrompt,

      messages: modelMessages,

      onFinish: async ({ responseMessages }) => {
        console.log("Stream finished. Starting auto-save...");

        if (data?.assessmentData) {
          console.log(
            "Assessment data received in API:",

            JSON.stringify(data.assessmentData),
          );

          const { userId, id: assessmentId } = data.assessmentData;

          if (!userId || !assessmentId) {
            console.warn(
              "Missing userId or assessmentId in assessmentData:",

              data.assessmentData,
            );

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
                (p: any) => p.type === "text" && p.text === "[INIT_ASSESSMENT]",
              ))
          ) {
            const firstAssistantMsg = responseMessages.find(
              (m) => m.role === "assistant",
            );

            if (
              firstAssistantMsg &&
              firstAssistantMsg.content &&
              Array.isArray(firstAssistantMsg.content)
            ) {
              const textPart = firstAssistantMsg.content.find(
                (p: any) => p.type === "text",
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
            console.log(
              `Auto-saving chat session for assessment: ${assessmentId}, user: ${userId}`,
            );

            await upsertChatSession({
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

              metadata: {
                assessmentId,

                userId,

                messagesCount: allMessages.length,
              },
            });
          }
        }
      },
    });
  });

  // Note: Depending on your exact Vercel AI SDK version (5.0+), you usually want toDataStreamResponse()

  // here instead of toUIMessageStreamResponse() if you run into any weird chunking errors on the frontend.

  return result.toUIMessageStreamResponse();
}
