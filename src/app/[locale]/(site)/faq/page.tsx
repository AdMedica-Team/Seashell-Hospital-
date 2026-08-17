import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { pick } from "@/lib/i18n-content";
import { FaqAccordion } from "@/components/site/FaqAccordion";

export default async function FaqPage({
  params,
}: PageProps<"/[locale]/faq">) {
  const { locale } = await params;

  const items = await prisma.fAQItem.findMany({
    where: { isPublished: true },
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: pick(item.questionEn, item.questionAr, locale),
      acceptedAnswer: {
        "@type": "Answer",
        text: pick(item.answerEn, item.answerAr, locale),
      },
    })),
  };

  return (
    <FaqContent items={items} locale={locale} jsonLd={jsonLd} />
  );
}

function FaqContent({
  items,
  locale,
  jsonLd,
}: {
  items: Parameters<typeof FaqAccordion>[0]["items"];
  locale: string;
  jsonLd: object;
}) {
  const t = useTranslations("pages.faq");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="font-display text-xs font-bold uppercase tracking-wide text-teal">{t("eyebrow")}</p>
      <h1 className="mt-2 font-display text-4xl text-ink">{t("heading")}</h1>

      <div className="mt-10">
        {items.length === 0 ? (
          <p className="text-muted">{t("noItems")}</p>
        ) : (
          <FaqAccordion items={items} locale={locale} />
        )}
      </div>
    </div>
  );
}
