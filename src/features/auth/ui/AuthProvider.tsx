"use client";

import { useEffect } from "react";
import { createClient } from "@shared/api/supabase/client";
import { useAuthStore } from "../model/use-auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      initialize();
    });

    return () => subscription.unsubscribe();
  }, [initialize]);

  return <>{children}</>;
}
