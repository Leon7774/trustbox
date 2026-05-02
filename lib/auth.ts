import { createClient } from "@/utils/supabase/server";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAuthUser() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) throw error;

    // DAL
    if (data?.user) {
      const [dbUser] = await db
        .select()
        .from(users)
        .where(eq(users.anonymousId, data.user.id))
        .limit(1);

      // Return a combined user object
      return {
        ...data.user,
        dbUser: dbUser || null,
      };
    } else {
      return null;
    }
  } catch (error) {
    // Fails silently on the frontend, logs on the backend
    console.error("Auth fetch error:", error);
    return null;
  }
}
