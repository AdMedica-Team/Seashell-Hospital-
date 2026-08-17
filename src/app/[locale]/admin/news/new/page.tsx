import { useTranslations } from "next-intl";
import { requireRole } from "@/lib/dal";
import { NewsForm } from "@/components/admin/NewsForm";

export default async function NewNewsPage() {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  return <NewNewsContent />;
}

function NewNewsContent() {
  const t = useTranslations("admin.news");
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl text-ink">{t("newPost")}</h1>
      <div className="mt-6">
        <NewsForm />
      </div>
    </div>
  );
}
