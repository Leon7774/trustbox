"use server";

import { db } from "@/db";
import { users, assessments } from "@/db/schema";
import { randomBytes } from "crypto";
import { createClient } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";

export async function submitAssessmentAction(data: {
  behavioralScore: number;
  passwordScore: number;
  urlScore: number;
  totalScore: number;
  riskLevel: "Low" | "Medium" | "High";
  rawResponses: any;
}) {
  try {
    let dbUser;
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    const anonId = authUser ? authUser.id : randomBytes(16).toString("hex");

    if (authUser) {
      const existingUser = await db.select().from(users).where(eq(users.anonymousId, anonId));
      if (existingUser.length > 0) {
        dbUser = existingUser[0];
      } else {
        dbUser = await db
          .insert(users)
          .values({ anonymousId: anonId })
          .returning()
          .then((res) => res[0]);
      }
    } else {
      dbUser = await db
        .insert(users)
        .values({ anonymousId: anonId })
        .returning()
        .then((res) => res[0]);
    }

    const aiRecommendation = "Moved to chat interface.";

    // 3. Save to database
    const assessment = await db
      .insert(assessments)
      .values({
        userId: dbUser.id,
        behavioralScore: data.behavioralScore,
        passwordScore: data.passwordScore,
        urlScore: data.urlScore,
        totalScore: data.totalScore,
        riskLevel: data.riskLevel,
        recommendedActions: aiRecommendation,
        rawResponses: data.rawResponses,
      })
      .returning()
      .then((res) => res[0]);

    return {
      success: true,
      assessmentId: assessment.id,
      recommendations: aiRecommendation,
    };
  } catch (error) {
    console.error("Failed to submit assessment:", error);
    
    if (process.env.NODE_ENV === "development") {
      console.warn("DEV BYPASS: Proceeding with mock assessment ID because DB is offline.");
      return {
        success: true,
        assessmentId: "mock-dev-id",
        recommendations: "Moved to chat interface.",
      };
    }

    return {
      success: false,
      error: "Failed to submit assessment",
      recommendations: "Moved to chat interface.",
    };
  }
}
