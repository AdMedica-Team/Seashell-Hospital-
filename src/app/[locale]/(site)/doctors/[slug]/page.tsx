import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/i18n-content";
import type { Prisma } from "@/generated/prisma/client";

export default async function DoctorProfilePage({
  params,
}: PageProps<"/[locale]/doctors/[slug]">) {
  const { locale, slug } = await params;

  const doctor = await prisma.doctor.findUnique({
    where: { slug },
    include: { departments: { include: { department: true } } },
  });

  if (!doctor || !doctor.isPublished) notFound();

  return <DoctorProfileContent doctor={doctor} locale={locale} />;
}

type DoctorDetail = Prisma.DoctorGetPayload<{
  include: { departments: { include: { department: true } } };
}>;

function DoctorProfileContent({ doctor, locale }: { doctor: DoctorDetail; locale: string }) {
  const t = useTranslations("pages.doctors");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="font-display text-xs font-bold uppercase tracking-wide text-teal">
        {doctor.departments.map((d) => pick(d.department.nameEn, d.department.nameAr, locale)).join(", ")}
      </p>
      <h1 className="mt-2 font-display text-4xl text-ink">{pick(doctor.nameEn, doctor.nameAr, locale)}</h1>
      <p className="mt-1 text-lg text-muted">{pick(doctor.titleEn, doctor.titleAr, locale)}</p>

      {doctor.languages.length > 0 && (
        <p className="mt-4 text-sm text-ink/80">
          {t("languages")}: {doctor.languages.join(", ")}
        </p>
      )}

      <p className="mt-6 whitespace-pre-line text-ink/80">{pick(doctor.bioEn, doctor.bioAr, locale)}</p>

      {doctor.departments.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-lg text-ink">{t("departments")}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {doctor.departments.map(({ department }) => (
              <Link
                key={department.id}
                href={`/departments/${department.slug}`}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm text-ink hover:border-teal"
              >
                {pick(department.nameEn, department.nameAr, locale)}
              </Link>
            ))}
          </div>
        </div>
      )}

      <Link
        href={
          (doctor.departments.find((d) => d.isPrimary) ?? doctor.departments[0])
            ? `/appointment?department=${(doctor.departments.find((d) => d.isPrimary) ?? doctor.departments[0]).department.slug}`
            : "/appointment"
        }
        className="mt-10 inline-block rounded-full bg-teal px-6 py-3 text-sm font-medium text-white"
      >
        {t("bookWith", { name: pick(doctor.nameEn, doctor.nameAr, locale) })}
      </Link>
    </div>
  );
}
