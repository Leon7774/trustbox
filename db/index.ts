import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.NEXT_PRIVATE_SUPABASE_SESSION_POOLER || "";

// Connection caching for development to prevent exhausting pool
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

export const client =
  globalForDb.conn ??
  postgres(connectionString, {
    prepare: false,
    max: process.env.NODE_ENV === "production" ? undefined : 1,
  });
if (process.env.NODE_ENV !== "production") globalForDb.conn = client;

export const db = drizzle(client, { schema });
