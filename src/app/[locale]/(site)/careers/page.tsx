import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/i18n-content";
import type { JobOpening } from "@/generated/prisma/client";

export default async function CareersIndexPage({
  params,
}: PageProps<"/[locale]/careers">) {
  const { locale } = await params;
  const jobs = await prisma.jobOpening.findMany({
    where: { isOpen: true },
    orderBy: { postedAt: "desc" },
  });

  return <CareersIndexContent jobs={jobs} locale={locale} />;
}

function CareersIndexContent({ jobs, locale }: { jobs: JobOpening[]; locale: string }) {
  const t = useTranslations("pages.careers");

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="font-display text-xs font-bold uppercase tracking-wide text-teal">{t("eyebrow")}</p>
      <h1 className="mt-2 font-display text-4xl text-ink">{t("heading")}</h1>

      {jobs.length === 0 && <p className="mt-10 text-muted">{t("noOpenings")}</p>}

      <div className="mt-10 flex flex-col gap-3">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/careers/${job.slug}`}
            className="rounded-2xl border border-line bg-white p-5 hover:border-teal"
          >
            <h3 className="font-display text-lg text-ink">{pick(job.titleEn, job.titleAr, locale)}</h3>
            {job.closesAt && (
              <p className="mt-1 text-xs text-muted">
                {t("closesOn", { date: new Date(job.closesAt).toLocaleDateString(locale) })}
              </p>
            )}
            <span className="mt-2 inline-block text-xs font-medium text-teal">{t("viewDetails")} →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
