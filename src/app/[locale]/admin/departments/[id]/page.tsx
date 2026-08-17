import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { requireRole } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { DepartmentForm } from "@/components/admin/DepartmentForm";
import type { Department, DepartmentProcedure } from "@/generated/prisma/client";

export default async function EditDepartmentPage({
  params,
}: PageProps<"/[locale]/admin/departments/[id]">) {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  const { id } = await params;

  const department = await prisma.department.findUnique({
    where: { id },
    include: { procedures: { orderBy: { order: "asc" } } },
  });
  if (!department) notFound();

  return <EditDepartmentContent department={department} />;
}

function EditDepartmentContent({
  department,
}: {
  department: Department & { procedures: DepartmentProcedure[] };
}) {
  const t = useTranslations("admin.common");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl text-ink">
        {t("edit")} · {department.nameEn}
      </h1>
      <div className="mt-6">
        <DepartmentForm department={department} />
      </div>
    </div>
  );
}
