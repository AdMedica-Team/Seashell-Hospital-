import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/i18n-content";
import type { Department } from "@/generated/prisma/client";

export default async function DepartmentsIndexPage({
  params,
}: PageProps<"/[locale]/departments">) {
  const { locale } = await params;
  const departments = await prisma.department.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });

  return <DepartmentsIndexContent departments={departments} locale={locale} />;
}

function DepartmentsIndexContent({
  departments,
  locale,
}: {
  departments: Department[];
  locale: string;
}) {
  const t = useTranslations("pages.departments");

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="font-display text-xs font-bold uppercase tracking-wide text-teal">{t("eyebrow")}</p>
      <h1 className="mt-2 font-display text-4xl text-ink">{t("heading")}</h1>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept) => (
          <Link
            key={dept.id}
            href={`/departments/${dept.slug}`}
            className="rounded-2xl border border-line bg-white p-5 hover:border-teal"
          >
            <h3 className="font-display text-lg text-ink">{pick(dept.nameEn, dept.nameAr, locale)}</h3>
            <p className="mt-2 text-sm text-muted">{pick(dept.summaryEn, dept.summaryAr, locale)}</p>
            <span className="mt-3 inline-block text-xs font-medium text-teal">{t("viewDetails")} →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
