"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

type UserContextType = {
  user: User | null;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export function UserProvider({
  children,
  serverUser,
}: {
  children: React.ReactNode;
  serverUser: User | null;
}) {
  const [user, setUser] = useState<User | null>(serverUser);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Listen for auth events (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);

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
