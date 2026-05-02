"use server";

import { db } from "@/db";
import { chatSessions } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { logError } from "@/lib/logger";

import fs from "fs";
import path from "path";

export async function saveChatSession({
  userId,
  assessmentId,
  messages,
  title,
}: {
  userId: number;
  assessmentId: number;
  messages: any[];
  title?: string;
}) {
  const logDir = path.join(process.cwd(), "logs");
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
  const logFile = path.join(logDir, "chat_saves.log");
  const logEntry = `[${new Date().toISOString()}] Entering saveChatSession: User ${userId}, Assessment ${assessmentId}, Msgs: ${messages.length}, Title: ${title}\n`;
  fs.appendFileSync(logFile, logEntry);

  console.log(`[CHAT_SAVE] Attempting to save session. User: ${userId}, Assessment: ${assessmentId}`);

  if (isNaN(Number(userId)) || isNaN(Number(assessmentId))) {
    console.error(`[CHAT_SAVE] Invalid IDs: User: ${userId}, Assessment: ${assessmentId}`);
    return;
  }

  try {
    // Check if session exists
    const existing = await db
      .select()
      .from(chatSessions)
      .where(
        and(
          eq(chatSessions.userId, userId),
          eq(chatSessions.assessmentId, assessmentId)
        )
      )
      .limit(1)
      .then((res) => res[0]);

    if (existing) {
      await db
        .update(chatSessions)
        .set({
          messages,
          title: title || existing.title,
          updatedAt: new Date(),
        })
        .where(eq(chatSessions.id, existing.id));
      
      return existing.id;
    } else {
      const [newSession] = await db
        .insert(chatSessions)
        .values({
          userId,
          assessmentId,
          messages,
          title: title || "New Chat",
        })
        .returning();
      
      return newSession.id;
    }
  } catch (error) {
    console.error("Error saving chat session:", error);
    await logError({
      action: "SAVE_CHAT_SESSION_ACTION",
      error,
      metadata: { userId, assessmentId, messagesCount: messages?.length }
    });
    throw new Error("Failed to save chat session");
  } finally {
    revalidatePath("/dashboard/assessments");
    revalidatePath(`/dashboard/tools/assessment/results/${assessmentId}`);
  }
}

export async function getChatSessions(userId: number) {
  try {
    return await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.userId, userId))
      .orderBy(desc(chatSessions.updatedAt));
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    return [];
  }
}

export async function getChatSession(userId: number, assessmentId: number) {
  try {
    const session = await db
      .select()
      .from(chatSessions)
      .where(
        and(
          eq(chatSessions.userId, userId),
          eq(chatSessions.assessmentId, assessmentId)
        )
      )
      .limit(1)
      .then((res) => res[0]);
    
    return session || null;
  } catch (error) {
    console.error("Error fetching chat session:", error);
    return null;
  }
}

export async function deleteChatSession(sessionId: number) {
  try {
    await db.delete(chatSessions).where(eq(chatSessions.id, sessionId));
    revalidatePath("/dashboard/assessments");
    return { success: true };
  } catch (error) {
    console.error("Error deleting chat session:", error);
    return { success: false };
  }
}
