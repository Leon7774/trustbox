import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, data } = await req.json();

  let systemPrompt = "You are TrustBox's AI Security Advisor. You act as an expert cybersecurity analyst providing actionable advice. Format your responses with clean spacing and bullet points where useful. Be concise.";
  if (data?.assessmentData) {
    const d = data.assessmentData;
    systemPrompt += `\n\nThe user just completed their cyber assessment. Here are their performance metrics:\n- Behavioral & Awareness Score: ${d.behavioralScore.toFixed(0)}/100\n- Password Strength Score: ${d.passwordScore.toFixed(0)}/100\n- Assessed Risk Level: ${d.riskLevel}\n\nHelp them understand these specific vulnerabilities. Address them directly and refer to their scores naturally during the conversation. Answer any questions they have about improving their security posture.`;
  }

  const lastMessage = messages[messages.length - 1];
  if (lastMessage?.content === "[INIT_ASSESSMENT]") {
    systemPrompt += `\n\nThe UI just securely provided you the scores. DO NOT acknowledge the string '[INIT_ASSESSMENT]'. Start the conversation immediately by briefly saying hello and giving them 3 short, personalized, actionable bullet points about how to improve their security based strictly on their weakest score.`;
  }

  const result = await streamText({
    model: google("gemini-2.5-flash"),
    system: systemPrompt,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
