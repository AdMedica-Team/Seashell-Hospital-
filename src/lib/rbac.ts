import type { Role } from "@/generated/prisma/client";

/**
 * Permission matrix for the CMS (SOW #3). Resources beyond "users" and
 * "auditLog" are placeholders for the content entities Phase 3 adds
 * (doctors, departments, news, ...) — content editors get read/write on all
 * of them, marketing admins add SEO/homepage/testimonial-approval/careers,
 * super admins get everything including user management.
 */
export type Permission =
  | "content:write"
  | "seo:write"
  | "homepage:write"
  | "testimonial:approve"
  | "careers:manage"
  | "users:manage"
  | "integrations:manage"
  | "auditLog:read";

const ROLE_PERMISSIONS: Record<Role, Set<Permission>> = {
  CONTENT_EDITOR: new Set(["content:write"]),
  MARKETING_ADMIN: new Set([
    "content:write",
    "seo:write",
    "homepage:write",
    "testimonial:approve",
    "careers:manage",
  ]),
  SUPER_ADMIN: new Set([
    "content:write",
    "seo:write",
    "homepage:write",
    "testimonial:approve",
    "careers:manage",
    "users:manage",
    "integrations:manage",
    "auditLog:read",
  ]),
};

export function can(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].has(permission);
}

export function isSuperAdmin(role: Role): boolean {
  return role === "SUPER_ADMIN";
}
