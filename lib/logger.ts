import { db } from "@/db";
import { errorLogs } from "@/db/schema";

interface LogErrorParams {
  userId?: number;
  action: string;
  error: any;
  metadata?: any;
}

/**
 * Logs an error to the database.
 * Falls back to console.error if the database operation fails.
 */
export async function logError({ userId, action, error, metadata }: LogErrorParams) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  console.error(`[ERROR LOG] ${action}:`, {
    userId,
    error: errorMessage,
    stack: errorStack,
    metadata,
  });

  try {
    await db.insert(errorLogs).values({
      userId,
      action,
      error: errorStack || errorMessage,
      metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
    });
  } catch (dbError) {
    console.error("CRITICAL: Failed to log error to database:", dbError);
  }
}
