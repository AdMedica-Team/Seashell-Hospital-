import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { CentersOfExcellenceShowcase } from "@/components/site/CentersOfExcellenceShowcase";

export default async function CentersOfExcellencePage({
  params,
}: PageProps<"/[locale]/centers-of-excellence">) {
  const { locale } = await params;

  const departments = await prisma.department.findMany({
    where: { isPublished: true, isCenterOfExcellence: true },
    orderBy: { order: "asc" },
    include: { procedures: { orderBy: { order: "asc" } } },
  });

  return <CentersOfExcellenceContent departments={departments} locale={locale} />;
}

function CentersOfExcellenceContent({
  departments,
  locale,
}: {
  departments: Parameters<typeof CentersOfExcellenceShowcase>[0]["departments"];
  locale: string;
}) {
  const t = useTranslations("pages.centersOfExcellence");

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="font-display text-xs font-bold uppercase tracking-wide text-teal">{t("eyebrow")}</p>
      <h1 className="mt-2 font-display text-4xl text-ink">{t("heading")}</h1>
      <div className="mt-10">
        <CentersOfExcellenceShowcase departments={departments} locale={locale} />
      </div>
    </div>
  );
}
