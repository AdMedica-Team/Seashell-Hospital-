import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { Role } from "@/generated/prisma/client";

/**
 * Centralized auth checks (Next.js Data Access Layer pattern). The proxy
 * already redirects unauthenticated/wrong-role requests away from /admin at
 * the edge — these are the defense-in-depth checks close to the data and
 * Server Actions, per the Next.js authentication guide.
 */
export const verifySession = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  return session;
});

export async function requireRole(allowed: Role[]) {
  const session = await verifySession();
  if (!allowed.includes(session.user.role)) {
    redirect("/admin/dashboard");
  }
  return session;
}
