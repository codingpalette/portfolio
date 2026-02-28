import type { UserWithProfile } from "@entities/user";
import { createClient } from "./server";

export async function getCurrentUser(): Promise<UserWithProfile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    id: user.id,
    email: user.email ?? "",
    profile,
  };
}
