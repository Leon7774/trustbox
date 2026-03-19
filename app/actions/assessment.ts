"use server";

import { db } from "@/db";
import { users, assessments } from "@/db/schema";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { randomBytes } from "crypto";

export async function submitAssessmentAction(data: {
  behavioralScore: number;
  passwordScore: number;
  urlScore: number;
  totalScore: number;
  riskLevel: "Low" | "Medium" | "High";
  rawResponses: any;
}) {
  try {
    // 1. Get or create anonymous user
    // For a real app, we'd use cookies to persist session. We'll generate a random ID here.
    const anonId = randomBytes(16).toString("hex");
    let user = await db.insert(users).values({ anonymousId: anonId }).returning().then(res => res[0]);

    // 2. Generate AI Recommendations based on scores
    const prompt = `
      You are an expert cybersecurity advisor. A user has completed a cyber risk assessment.
      Their scores (out of 100):
      - Behavioral Risk Score: ${data.behavioralScore} (Measures cyber hygiene and awareness)
      - Password Strength Score: ${data.passwordScore} (Measures entropy and complexity habits)
      - URL Checking Score: ${data.urlScore} (Measures phishing awareness)
      - Overall Score: ${data.totalScore}
      - Risk Level: ${data.riskLevel}

      Provide exactly 3 short, actionable, unnumbered bullet points (each starting with a markdown standard bullet, e.g. - ) giving them personalized advice.
      Focus strictly on their weakest area. Be extremely concise. Do not include introductory text.
    `;

    let aiRecommendation = "Enable Two-Factor Authentication, use a Password Manager, and verify all URLs before clicking.";
    try {
      if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        const { text } = await generateText({
          model: google("gemini-2.5-flash"),
          prompt: prompt,
        });
        aiRecommendation = text;
      }
    } catch (e) {
      console.log("AI Generation skipped or failed, using fallback.", e);
    }

    // 3. Save to database
    const assessment = await db.insert(assessments).values({
      userId: user.id,
      behavioralScore: data.behavioralScore,
      passwordScore: data.passwordScore,
      urlScore: data.urlScore,
      totalScore: data.totalScore,
      riskLevel: data.riskLevel,
      recommendedActions: aiRecommendation,
      rawResponses: data.rawResponses,
    }).returning().then(res => res[0]);

    return { success: true, assessmentId: assessment.id, recommendations: aiRecommendation };
  } catch (error) {
    console.error("Failed to submit assessment:", error);
    return { success: false, error: "Failed to submit assessment" };
  }
}
