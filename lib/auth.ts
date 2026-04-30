import { createClient } from "@/utils/supabase/server";

export async function getAuthUser() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) throw error;

    // DAL
    if (data?.user) {
      // Only return what the UI actually needs to know
      return {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.full_name || "User",
      };
    }
  } catch (error) {
    // Fails silently on the frontend, logs on the backend
    console.error("Auth fetch error:", error);
    return null;
  }
}
