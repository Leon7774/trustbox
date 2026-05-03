"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { chatSessions } from "@/db/schema";
import { logError } from "@/lib/logger";
import {
  upsertChatSession,
  fetchChatSession,
  fetchAllChatSessions,
} from "@/lib/chat-db";

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
  try {
    const sessionId = await upsertChatSession({
      userId,
      assessmentId,
      messages,
      title,
    });
    return sessionId;
  } catch (error) {
    console.error("Error saving chat session:", error);
    await logError({
      action: "SAVE_CHAT_SESSION_ACTION",
      error,
      metadata: { userId, assessmentId, messagesCount: messages?.length },
    });
    throw new Error("Failed to save chat session");
  } finally {
    revalidatePath("/dashboard/assessments");
    revalidatePath(`/dashboard/tools/assessment/results/${assessmentId}`);
  }
}

export async function getChatSessions(userId: number) {
  try {
    return await fetchAllChatSessions(userId);
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    return [];
  }
}

export async function getChatSession(userId: number, assessmentId: number) {
  try {
    return await fetchChatSession(userId, assessmentId);
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
