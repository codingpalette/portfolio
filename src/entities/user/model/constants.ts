import type { AccessLevel } from "./types";

export const ROLE_HIERARCHY: Record<AccessLevel, number> = {
  guest: 0,
  user: 1,
  admin: 2,
};

export const ROUTE_ACCESS: Record<string, AccessLevel> = {
  "/admin": "admin",
  "/dashboard": "user",
};

export const AUTH_ROUTES = ["/login", "/signup"];

export const LOGIN_REDIRECT = "/login";

export const DEFAULT_REDIRECT = "/";
