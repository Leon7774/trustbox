import { useContext } from "react";
import { User } from "@supabase/supabase-js";
import {
  UserContext,
  UserContextType,
} from "@/components/providers/UserProvider";

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
