import { useTranslations } from "next-intl";
import { requireRole } from "@/lib/dal";
import { FaqForm } from "@/components/admin/FaqForm";

export default async function NewFaqPage() {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  return <NewFaqContent />;
}

function NewFaqContent() {
  const t = useTranslations("admin.faq");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl text-ink">{t("newFaq")}</h1>
      <div className="mt-6">
        <FaqForm />
      </div>
    </div>
  );
}
