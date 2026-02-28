"use client";

import { ROLE_HIERARCHY } from "@entities/user";
import type { AccessLevel } from "@entities/user";
import { useAuthStore } from "../model/use-auth-store";

interface RequireRoleProps {
  minimum: AccessLevel;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RequireRole({ minimum, children, fallback }: RequireRoleProps) {
  const { user, isLoading } = useAuthStore();

  if (isLoading) return null;

  const currentLevel: AccessLevel = user?.profile.role ?? "guest";
  const hasAccess = ROLE_HIERARCHY[currentLevel] >= ROLE_HIERARCHY[minimum];

  if (!hasAccess) return fallback ?? null;

  return <>{children}</>;
}
