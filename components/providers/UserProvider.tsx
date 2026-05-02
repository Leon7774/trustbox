"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { type User as DbUser } from "@/db/schema";

export type AppUser = User & { dbUser: DbUser | null };

export type UserContextType = {
  user: AppUser | null;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export function UserProvider({
  children,
  serverUser,
}: {
  children: React.ReactNode;
  serverUser: AppUser | null;
}) {
  const [user, setUser] = useState<AppUser | null>(serverUser);
  const router = useRouter();
  const supabase = createClient();

  // Sync state with server user so updates via Server Actions & router.refresh()
  // propagate to the client context immediately.
  useEffect(() => {
    setUser(serverUser);
  }, [serverUser]);

  useEffect(() => {
    // Listen for auth events (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        setUser(null);
      } else {
        // Only override the auth portion of the user object;
        // leave dbUser intact until router.refresh() fetches the latest from the server.
        setUser((prev) =>
          prev
            ? { ...session.user, dbUser: prev.dbUser }
            : { ...session.user, dbUser: null },
        );
      }

      // Industry Standard: Force Next.js to re-evaluate Server Components
      // when the auth state changes so protected routes update instantly.
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}
