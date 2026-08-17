import { prisma } from "@/lib/db";

/** SiteSettings is a singleton — this returns the one row, creating it with defaults if missing. */
export async function getSiteSettings() {
  const existing = await prisma.siteSettings.findFirst();
  if (existing) return existing;
  return prisma.siteSettings.create({ data: {} });
}
