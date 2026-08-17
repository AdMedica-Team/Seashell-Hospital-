import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/i18n-content";
import type { Doctor } from "@/generated/prisma/client";

export default async function DoctorsIndexPage({
  params,
}: PageProps<"/[locale]/doctors">) {
  const { locale } = await params;
  const doctors = await prisma.doctor.findMany({
    where: { isPublished: true },
    orderBy: { nameEn: "asc" },
    include: { departments: { include: { department: true } } },
  });

  return <DoctorsIndexContent doctors={doctors} locale={locale} />;
}

type DoctorRow = Doctor & { departments: { department: { nameEn: string; nameAr: string } }[] };

function DoctorsIndexContent({ doctors, locale }: { doctors: DoctorRow[]; locale: string }) {
  const t = useTranslations("pages.doctors");

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="font-display text-xs font-bold uppercase tracking-wide text-teal">{t("eyebrow")}</p>
      <h1 className="mt-2 font-display text-4xl text-ink">{t("heading")}</h1>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor) => (
          <Link
            key={doctor.id}
            href={`/doctors/${doctor.slug}`}
            className="rounded-2xl border border-line bg-white p-5 hover:border-teal"
          >
            <p className="text-xs uppercase tracking-wide text-teal">
              {doctor.departments.map((d) => pick(d.department.nameEn, d.department.nameAr, locale)).join(", ")}
            </p>
            <h3 className="mt-2 font-display text-lg text-ink">{pick(doctor.nameEn, doctor.nameAr, locale)}</h3>
            <p className="text-sm text-muted">{pick(doctor.titleEn, doctor.titleAr, locale)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
