import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { SpecialtySlider } from "@/components/site/SpecialtySlider";

export async function ClinicalExcellence({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "clinicalExcellence" });
  const departments = await prisma.department.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    include: { procedures: { orderBy: { order: "asc" } } },
  });

  return (
    <section className="bg-[linear-gradient(135deg,#eaf3ff_0%,#f5f9ff_50%,#ffffff_100%)] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-3xl text-ink sm:text-4xl">{t("heading")}</h2>
        <p className="mt-5 max-w-4xl text-ink/80">{t("body1")}</p>
        <p className="mt-4 max-w-4xl text-ink/80">{t("body2")}</p>

        <div className="mt-8">
          <SpecialtySlider departments={departments} locale={locale} />
        </div>
      </div>
    </section>
  );
}
