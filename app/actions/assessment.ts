"use server";

import { db } from "@/db";
import { users, assessments } from "@/db/schema";
import { randomBytes } from "crypto";
import { createClient } from "@/utils/supabase/server";
import { eq, desc, sql } from "drizzle-orm";
import { logError } from "@/lib/logger";

export async function submitAssessmentAction(data: {
  behavioralScore: number;
  totalScore: number;
  riskLevel: "Low" | "Medium" | "High";
  rawResponses: any;
}) {
  try {
    let dbUser;
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const currentId = authUser ? authUser.id : randomBytes(16).toString("hex");

    // If someone's logged in
    if (authUser) {
      // Check if the auth has a corresponding users table entry
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.anonymousId, currentId));
      // If yes, assign it to current database user
      if (existingUser.length > 0) {
        dbUser = existingUser[0];
      } else {
        // Else, insert the current unregistered user to the users table and grab that row
        dbUser = await db
          .insert(users)
          .values({ anonymousId: currentId })
          .returning()
          .then((res) => res[0]);
      }
    } else {
      // If they aren't logged in (no auth) make a new row in the users table
      // TODO: There shouldn't be a case where users reach this page without logging in.
      dbUser = await db
        .insert(users)
        .values({ anonymousId: currentId })
        .returning()
        .then((res) => res[0]);
    }

    const aiRecommendation = "Moved to chat interface.";

    // 3. Save to database
    const assessment = await db
      .insert(assessments)
      .values({
        userId: dbUser.id,
        behavioralScore: Math.round(data.behavioralScore),
        totalScore: Math.round(data.totalScore),
        riskLevel: data.riskLevel,
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
    await logError({
      action: "SUBMIT_ASSESSMENT",
      error,
      metadata: {
        behavioralScore: data.behavioralScore,
        totalScore: data.totalScore,
        riskLevel: data.riskLevel,
        rawResponses: data.rawResponses,
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.warn(
        "DEV BYPASS: Proceeding with mock assessment ID because DB is offline.",
      );
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

export async function getAssessmentsAction(
  page: number = 1,
  pageSize: number = 10,
) {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return { success: false, error: "Not authenticated" };
    }

    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.anonymousId, authUser.id))
      .then((res) => res[0]);

    if (!dbUser) {
      return { success: true, assessments: [], totalCount: 0, totalPages: 0 };
    }

    const offset = (page - 1) * pageSize;

    const data = await db
      .select()
      .from(assessments)
      .where(eq(assessments.userId, dbUser.id))
      .orderBy(desc(assessments.createdAt))
      .limit(pageSize)
      .offset(offset);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(assessments)
      .where(eq(assessments.userId, dbUser.id));

    const totalCount = Number(countResult?.count || 0);

    return {
      success: true,
      assessments: data,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  } catch (error) {
    console.error("Failed to fetch assessments:", error);
    return { success: false, error: "Failed to fetch assessments" };
  }
}
