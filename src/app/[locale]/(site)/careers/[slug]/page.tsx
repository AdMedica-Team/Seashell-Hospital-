import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/i18n-content";
import type { JobOpening } from "@/generated/prisma/client";

export default async function JobDetailPage({
  params,
}: PageProps<"/[locale]/careers/[slug]">) {
  const { locale, slug } = await params;

  const job = await prisma.jobOpening.findUnique({ where: { slug } });
  if (!job || !job.isOpen) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <JobDetailContent job={job} locale={locale} />
    </div>
  );
}

function JobDetailContent({
  job,
  locale,
}: {
  job: JobOpening;
  locale: string;
}) {
  const t = useTranslations("pages.careers");

  return (
    <>
      <p className="font-display text-xs font-bold uppercase tracking-wide text-teal">{t("eyebrow")}</p>
      <h1 className="mt-2 font-display text-3xl text-ink">{pick(job.titleEn, job.titleAr, locale)}</h1>
      <p className="mt-6 whitespace-pre-line text-ink/80">{pick(job.descriptionEn, job.descriptionAr, locale)}</p>
      <Link
        href="/contact"
        className="mt-10 inline-block rounded-full bg-teal px-6 py-3 text-sm font-medium text-white"
      >
        {t("apply")}
      </Link>
    </>
  );
}
