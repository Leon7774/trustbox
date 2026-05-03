/**
 * Plain database helpers for chat sessions.
 * These are NOT server actions — they can be imported from both API routes and server actions.
 */
import { db } from "@/db";
import { chatSessions } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function upsertChatSession({
  userId,
  assessmentId,
  messages,
  title,
}: {
  userId: number;
  assessmentId: number;
  messages: any[];
  title?: string;
}): Promise<number> {
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
}

export async function fetchChatSession(userId: number, assessmentId: number) {
  return db
    .select()
    .from(chatSessions)
    .where(
      and(
        eq(chatSessions.userId, userId),
        eq(chatSessions.assessmentId, assessmentId)
      )
    )
    .limit(1)
    .then((res) => res[0] ?? null);
}

export async function fetchAllChatSessions(userId: number) {
  return db
    .select()
    .from(chatSessions)
    .where(eq(chatSessions.userId, userId))
    .orderBy(desc(chatSessions.updatedAt));
}
