import type { UserWithProfile } from "@entities/user";
import { create } from "zustand";
import { createClient } from "@shared/api/supabase/client";

interface AuthState {
  user: UserWithProfile | null;
  isLoading: boolean;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  initialize: async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      set({ user: null, isLoading: false });
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const fallbackProfile = {
      id: user.id,
      name: user.user_metadata?.name ?? "",
      role: "user" as const,
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    set({
      user: {
        id: user.id,
        email: user.email ?? "",
        profile: profile ?? fallbackProfile,
      },
      isLoading: false,
    });
  },

  logout: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
