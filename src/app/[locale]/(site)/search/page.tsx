import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/i18n-content";
import type { Department, Doctor } from "@/generated/prisma/client";

export default async function SearchPage({
  params,
  searchParams,
}: PageProps<"/[locale]/search">) {
  const { locale } = await params;
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  let departments: Department[] = [];
  let doctors: Doctor[] = [];

  if (query.length > 0) {
    [departments, doctors] = await Promise.all([
      prisma.department.findMany({
        where: {
          isPublished: true,
          OR: [
            { nameEn: { contains: query, mode: "insensitive" } },
            { nameAr: { contains: query, mode: "insensitive" } },
            { summaryEn: { contains: query, mode: "insensitive" } },
            { summaryAr: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 10,
      }),
      prisma.doctor.findMany({
        where: {
          isPublished: true,
          OR: [
            { nameEn: { contains: query, mode: "insensitive" } },
            { nameAr: { contains: query, mode: "insensitive" } },
            { titleEn: { contains: query, mode: "insensitive" } },
            { titleAr: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 10,
      }),
    ]);
  }

  return (
    <SearchResults query={query} departments={departments} doctors={doctors} locale={locale} />
  );
}

function SearchResults({
  query,
  departments,
  doctors,
  locale,
}: {
  query: string;
  departments: Department[];
  doctors: Doctor[];
  locale: string;
}) {
  const t = useTranslations("search");
  const hasResults = departments.length > 0 || doctors.length > 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl text-ink">{t("heading", { query })}</h1>

      {!hasResults && <p className="mt-6 text-muted">{t("noResults")}</p>}

      {departments.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-lg text-ink">{t("departments")}</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {departments.map((dept) => (
              <Link
                key={dept.id}
                href={`/departments/${dept.slug}`}
                className="rounded-xl border border-line bg-white p-4 hover:border-teal"
              >
                <p className="font-display text-ink">{pick(dept.nameEn, dept.nameAr, locale)}</p>
                <p className="text-sm text-muted">{pick(dept.summaryEn, dept.summaryAr, locale)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {doctors.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-lg text-ink">{t("doctors")}</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {doctors.map((doctor) => (
              <Link
                key={doctor.id}
                href={`/doctors/${doctor.slug}`}
                className="rounded-xl border border-line bg-white p-4 hover:border-teal"
              >
                <p className="font-display text-ink">{pick(doctor.nameEn, doctor.nameAr, locale)}</p>
                <p className="text-sm text-muted">{pick(doctor.titleEn, doctor.titleAr, locale)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
