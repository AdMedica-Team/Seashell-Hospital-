import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { Link } from "@/i18n/navigation";
import type { LeadershipMember } from "@/generated/prisma/client";

export default async function AdminLeadershipPage() {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  const items = await prisma.leadershipMember.findMany({ orderBy: { order: "asc" } });
  return <LeadershipList items={items} />;
}

function LeadershipList({ items }: { items: LeadershipMember[] }) {
  const t = useTranslations("admin.leadership");
  const tc = useTranslations("admin.common");
  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">{t("title")}</h1>
        <Link
          href="/admin/leadership/new"
          className="rounded-full bg-teal px-4 py-2 text-sm font-medium text-white"
        >
          {t("newMember")}
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
        <table className="w-full text-start text-sm">
          <thead className="bg-mint text-xs uppercase text-teal">
            <tr>
              <th className="px-4 py-3 text-start">{t("colName")}</th>
              <th className="px-4 py-3 text-start">{t("colRole")}</th>
              <th className="px-4 py-3 text-start">{tc("order")}</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-line">
                <td className="px-4 py-3">{item.nameEn}</td>
                <td className="px-4 py-3 text-muted">{item.titleEn}</td>
                <td className="px-4 py-3">{item.order}</td>
                <td className="px-4 py-3 text-end">
                  <Link
                    href={`/admin/leadership/${item.id}`}
                    className="rounded-full border border-line px-3 py-1 text-xs"
                  >
                    {tc("edit")}
                  </Link>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                  {t("empty")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
