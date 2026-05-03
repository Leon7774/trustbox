"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getAuthUser } from "@/lib/auth";

export async function completeTutorial() {
  const authUser = await getAuthUser();
  const dbUserId = authUser?.dbUser?.id;

  if (!dbUserId) {
    return { success: false };
  }

  await db
    .update(users)
    .set({ finishedTutorial: true })
    .where(eq(users.id, dbUserId));

  return { success: true };
}
