import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { Link } from "@/i18n/navigation";
import type { Testimonial } from "@/generated/prisma/client";

export default async function AdminTestimonialsPage() {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  const items = await prisma.testimonial.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return <TestimonialList items={items} />;
}

function TestimonialList({ items }: { items: Testimonial[] }) {
  const t = useTranslations("admin.testimonials");
  const tc = useTranslations("admin.common");
  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">{t("title")}</h1>
        <Link
          href="/admin/testimonials/new"
          className="rounded-full bg-teal px-4 py-2 text-sm font-medium text-white"
        >
          {t("newTestimonial")}
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
        <table className="w-full text-start text-sm">
          <thead className="bg-mint text-xs uppercase text-teal">
            <tr>
              <th className="px-4 py-3 text-start">{t("colName")}</th>
              <th className="px-4 py-3 text-start">{t("colType")}</th>
              <th className="px-4 py-3 text-start">{t("colConsent")}</th>
              <th className="px-4 py-3 text-start">{t("colPublished")}</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-line">
                <td className="px-4 py-3">{item.displayNameEn}</td>
                <td className="px-4 py-3 text-muted">
                  {item.videoUrl ? t("typeVideo") : t("typeText")}
                </td>
                <td className="px-4 py-3">
                  {item.consentObtained ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                      {tc("yes")}
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                      {tc("no")}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">{item.isPublished ? tc("yes") : tc("no")}</td>
                <td className="px-4 py-3 text-end">
                  <Link
                    href={`/admin/testimonials/${item.id}`}
                    className="rounded-full border border-line px-3 py-1 text-xs"
                  >
                    {tc("edit")}
                  </Link>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
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
