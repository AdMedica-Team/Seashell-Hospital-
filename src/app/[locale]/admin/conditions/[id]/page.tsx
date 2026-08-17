import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { requireRole } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { ConditionForm } from "@/components/admin/ConditionForm";
import type { Department, Doctor } from "@/generated/prisma/client";

export default async function EditConditionPage({
  params,
}: PageProps<"/[locale]/admin/conditions/[id]">) {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  const { id } = await params;

  const [condition, departments, doctors] = await Promise.all([
    prisma.condition.findUnique({
      where: { id },
      include: { departments: true, doctors: true },
    }),
    prisma.department.findMany({ orderBy: { order: "asc" } }),
    prisma.doctor.findMany({ orderBy: { nameEn: "asc" } }),
  ]);
  if (!condition) notFound();

  return <EditConditionContent condition={condition} departments={departments} doctors={doctors} />;
}

function EditConditionContent({
  condition,
  departments,
  doctors,
}: {
  condition: NonNullable<
    Awaited<ReturnType<typeof prisma.condition.findUnique>>
  > & {
    departments: { conditionId: string; departmentId: string }[];
    doctors: { conditionId: string; doctorId: string }[];
  };
  departments: Department[];
  doctors: Doctor[];
}) {
  const t = useTranslations("admin.common");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl text-ink">
        {t("edit")} · {condition.nameEn}
      </h1>
      <div className="mt-6">
        <ConditionForm condition={condition} departments={departments} doctors={doctors} />
      </div>
    </div>
  );
}
