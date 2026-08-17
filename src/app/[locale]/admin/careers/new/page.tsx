import { useTranslations } from "next-intl";
import { requireRole } from "@/lib/dal";
import { JobForm } from "@/components/admin/JobForm";

export default async function NewJobPage() {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  return <NewJobContent />;
}

function NewJobContent() {
  const t = useTranslations("admin.careers");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl text-ink">{t("newJob")}</h1>
      <div className="mt-6">
        <JobForm />
      </div>
    </div>
  );
}
