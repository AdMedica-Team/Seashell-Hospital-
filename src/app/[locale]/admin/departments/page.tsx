import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { Link } from "@/i18n/navigation";
import type { Department } from "@/generated/prisma/client";

export default async function AdminDepartmentsPage() {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  const departments = await prisma.department.findMany({ orderBy: { order: "asc" } });

  return <DepartmentsList departments={departments} />;
}

function DepartmentsList({ departments }: { departments: Department[] }) {
  const t = useTranslations("admin.departments");
  const tc = useTranslations("admin.common");

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">{t("title")}</h1>
        <Link href="/admin/departments/new" className="rounded-full bg-teal px-4 py-2 text-sm font-medium text-white">
          {t("newDepartment")}
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
        <table className="w-full text-start text-sm">
          <thead className="bg-mint text-xs uppercase text-teal">
            <tr>
              <th className="px-4 py-3 text-start">{t("colName")}</th>
              <th className="px-4 py-3 text-start">{t("colCoE")}</th>
              <th className="px-4 py-3 text-start">{t("colPublished")}</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id} className="border-t border-line">
                <td className="px-4 py-3">
                  {dept.nameEn} <span className="text-muted">· {dept.nameAr}</span>
                </td>
                <td className="px-4 py-3">{dept.isCenterOfExcellence ? tc("yes") : tc("no")}</td>
                <td className="px-4 py-3">{dept.isPublished ? tc("yes") : tc("no")}</td>
                <td className="px-4 py-3 text-end">
                  <Link href={`/admin/departments/${dept.id}`} className="rounded-full border border-line px-3 py-1 text-xs">
                    {tc("edit")}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
