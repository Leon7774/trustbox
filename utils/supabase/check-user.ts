import { createClient } from '@/utils/supabase/server'

/**
 * Check the current authenticated user via the server-side Supabase client.
 * Returns the user object if authenticated, or null if not.
 */
export async function checkUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}
