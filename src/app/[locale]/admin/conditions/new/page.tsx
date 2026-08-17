import { useTranslations } from "next-intl";
import { requireRole } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { ConditionForm } from "@/components/admin/ConditionForm";

export default async function NewConditionPage() {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  const [departments, doctors] = await Promise.all([
    prisma.department.findMany({ orderBy: { order: "asc" } }),
    prisma.doctor.findMany({ orderBy: { nameEn: "asc" } }),
  ]);

  return <NewConditionContent departments={departments} doctors={doctors} />;
}

function NewConditionContent({
  departments,
  doctors,
}: {
  departments: Awaited<ReturnType<typeof prisma.department.findMany>>;
  doctors: Awaited<ReturnType<typeof prisma.doctor.findMany>>;
}) {
  const t = useTranslations("admin.conditions");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl text-ink">{t("newCondition")}</h1>
      <div className="mt-6">
        <ConditionForm departments={departments} doctors={doctors} />
      </div>
    </div>
  );
}
