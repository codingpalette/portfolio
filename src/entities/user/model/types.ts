export type Role = "admin" | "user";

export type AccessLevel = Role | "guest";

export interface Profile {
  id: string;
  name: string;
  role: Role;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserWithProfile {
  id: string;
  email: string;
  profile: Profile;
}
