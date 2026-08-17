import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

export async function logAudit(params: {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  diff: Prisma.InputJsonValue;
}) {
  await prisma.auditLog.create({ data: params });
}
