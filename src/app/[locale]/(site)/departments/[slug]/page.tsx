import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/i18n-content";
import type { Prisma } from "@/generated/prisma/client";

export default async function DepartmentDetailPage({
  params,
}: PageProps<"/[locale]/departments/[slug]">) {
  const { locale, slug } = await params;

  const department = await prisma.department.findUnique({
    where: { slug },
    include: {
      procedures: { orderBy: { order: "asc" } },
      doctors: { include: { doctor: true } },
    },
  });

  if (!department || !department.isPublished) notFound();

  return <DepartmentDetailContent department={department} locale={locale} />;
}

type DepartmentDetail = Prisma.DepartmentGetPayload<{
  include: { procedures: true; doctors: { include: { doctor: true } } };
}>;

function DepartmentDetailContent({
  department,
  locale,
}: {
  department: DepartmentDetail;
  locale: string;
}) {
  const t = useTranslations("pages.departments");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="font-display text-xs font-bold uppercase tracking-wide text-teal">{t("eyebrow")}</p>
      <h1 className="mt-2 font-display text-4xl text-ink">{pick(department.nameEn, department.nameAr, locale)}</h1>
      <p className="mt-4 text-lg text-muted">{pick(department.summaryEn, department.summaryAr, locale)}</p>
      <p className="mt-6 whitespace-pre-line text-ink/80">{pick(department.descriptionEn, department.descriptionAr, locale)}</p>

      {department.procedures.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl text-ink">{t("procedures")}</h2>
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {department.procedures.map((proc) => (
              <li key={proc.id} className="rounded-xl border border-line bg-white px-4 py-2 text-sm text-ink">
                {pick(proc.nameEn, proc.nameAr, locale)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {department.doctors.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl text-ink">{t("linkedDoctors")}</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {department.doctors.map(({ doctor }) => (
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

      <Link
        href={`/appointment?department=${department.slug}`}
        className="mt-10 inline-block rounded-full bg-teal px-6 py-3 text-sm font-medium text-white"
      >
        {t("consultCta")}
      </Link>
    </div>
  );
}
