import { useTranslations } from "next-intl";
import { requireRole } from "@/lib/dal";
import { DepartmentForm } from "@/components/admin/DepartmentForm";

export default async function NewDepartmentPage() {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  return <NewDepartmentContent />;
}

function NewDepartmentContent() {
  const t = useTranslations("admin.departments");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl text-ink">{t("newDepartment")}</h1>
      <div className="mt-6">
        <DepartmentForm />
      </div>
    </div>
  );
}
