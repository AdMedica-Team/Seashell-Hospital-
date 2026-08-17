import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { requireRole } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { FaqForm } from "@/components/admin/FaqForm";
import type { FAQItem } from "@/generated/prisma/client";

export default async function EditFaqPage({
  params,
}: PageProps<"/[locale]/admin/faq/[id]">) {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  const { id } = await params;

  const faq = await prisma.fAQItem.findUnique({ where: { id } });
  if (!faq) notFound();

  return <EditFaqContent faq={faq} />;
}

function EditFaqContent({ faq }: { faq: FAQItem }) {
  const t = useTranslations("admin.common");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl text-ink">
        {t("edit")} · {faq.questionEn}
      </h1>
      <div className="mt-6">
        <FaqForm faq={faq} />
      </div>
    </div>
  );
}
