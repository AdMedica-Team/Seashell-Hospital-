import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { requireRole } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { AwardForm } from "@/components/admin/AwardForm";
import type { Award } from "@/generated/prisma/client";

export default async function EditAwardPage({ params }: PageProps<"/[locale]/admin/awards/[id]">) {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  const { id } = await params;
  const award = await prisma.award.findUnique({ where: { id } });
  if (!award) notFound();
  return <EditAwardContent award={award} />;
}

function EditAwardContent({ award }: { award: Award }) {
  const t = useTranslations("admin.common");
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl text-ink">
        {t("edit")} · {award.titleEn}
      </h1>
      <div className="mt-6">
        <AwardForm award={award} />
      </div>
    </div>
  );
}
