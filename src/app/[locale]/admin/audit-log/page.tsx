import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import type { Prisma } from "@/generated/prisma/client";

type AuditEntry = Prisma.AuditLogGetPayload<{
  include: { user: { select: { name: true; email: true } } };
}>;

export default async function AuditLogPage() {
  await requireRole(["SUPER_ADMIN"]);

  const entries = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { name: true, email: true } } },
  });

  return <AuditLogList entries={entries} />;
}

function AuditLogList({ entries }: { entries: AuditEntry[] }) {
  const t = useTranslations("admin.auditLog");

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-2xl text-ink">{t("title")}</h1>
      <div className="mt-6 flex flex-col gap-2">
        {entries.length === 0 && (
          <p className="text-sm text-muted">{t("empty")}</p>
        )}
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-xl border border-line bg-white px-4 py-3 text-sm"
          >
            <div className="flex items-center justify-between text-xs text-muted">
              <span>
                {entry.user.name} ({entry.user.email})
              </span>
              <span>{new Date(entry.createdAt).toLocaleString()}</span>
            </div>
            <p className="mt-1 font-medium text-ink">
              {entry.action} · {entry.entityType} #{entry.entityId}
            </p>
            <pre className="mt-1 overflow-x-auto rounded-lg bg-mint p-2 text-xs text-ink/80">
              {JSON.stringify(entry.diff, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
