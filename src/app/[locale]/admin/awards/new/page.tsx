import { useTranslations } from "next-intl";
import { requireRole } from "@/lib/dal";
import { AwardForm } from "@/components/admin/AwardForm";

export default async function NewAwardPage() {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  return <NewAwardContent />;
}

function NewAwardContent() {
  const t = useTranslations("admin.awards");
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl text-ink">{t("newAward")}</h1>
      <div className="mt-6">
        <AwardForm />
      </div>
    </div>
  );
}
