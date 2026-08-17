import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { Link } from "@/i18n/navigation";
import type { FAQItem } from "@/generated/prisma/client";

export default async function AdminFaqPage() {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  const items = await prisma.fAQItem.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });

  return <FaqList items={items} />;
}

function FaqList({ items }: { items: FAQItem[] }) {
  const t = useTranslations("admin.faq");
  const tc = useTranslations("admin.common");

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">{t("title")}</h1>
        <Link href="/admin/faq/new" className="rounded-full bg-teal px-4 py-2 text-sm font-medium text-white">
          {t("newFaq")}
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
        <table className="w-full text-start text-sm">
          <thead className="bg-mint text-xs uppercase text-teal">
            <tr>
              <th className="px-4 py-3 text-start">{t("colQuestion")}</th>
              <th className="px-4 py-3 text-start">{t("colCategory")}</th>
              <th className="px-4 py-3 text-start">{t("colPublished")}</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-line">
                <td className="px-4 py-3">{item.questionEn}</td>
                <td className="px-4 py-3 text-muted">{item.category}</td>
                <td className="px-4 py-3">{item.isPublished ? tc("yes") : tc("no")}</td>
                <td className="px-4 py-3 text-end">
                  <Link href={`/admin/faq/${item.id}`} className="rounded-full border border-line px-3 py-1 text-xs">
                    {tc("edit")}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
