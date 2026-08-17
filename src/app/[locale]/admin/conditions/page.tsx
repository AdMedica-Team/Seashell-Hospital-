import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { Link } from "@/i18n/navigation";
import type { Condition } from "@/generated/prisma/client";

export default async function AdminConditionsPage() {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  const conditions = await prisma.condition.findMany({
    orderBy: { nameEn: "asc" },
    include: {
      departments: { include: { department: true } },
      doctors: { include: { doctor: true } },
    },
  });

  return <ConditionsList conditions={conditions} />;
}

type ConditionRow = Condition & {
  departments: { department: { nameEn: string } }[];
  doctors: { doctor: { nameEn: string } }[];
};

function ConditionsList({ conditions }: { conditions: ConditionRow[] }) {
  const t = useTranslations("admin.conditions");
  const tc = useTranslations("admin.common");

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">{t("title")}</h1>
        <Link href="/admin/conditions/new" className="rounded-full bg-teal px-4 py-2 text-sm font-medium text-white">
          {t("newCondition")}
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
        <table className="w-full text-start text-sm">
          <thead className="bg-mint text-xs uppercase text-teal">
            <tr>
              <th className="px-4 py-3 text-start">{t("colName")}</th>
              <th className="px-4 py-3 text-start">{t("colDepartments")}</th>
              <th className="px-4 py-3 text-start">{t("colDoctors")}</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {conditions.map((condition) => (
              <tr key={condition.id} className="border-t border-line">
                <td className="px-4 py-3">
                  {condition.nameEn} <span className="text-muted">· {condition.nameAr}</span>
                </td>
                <td className="px-4 py-3 text-muted">
                  {condition.departments.map((d) => d.department.nameEn).join(", ") || "—"}
                </td>
                <td className="px-4 py-3 text-muted">
                  {condition.doctors.map((d) => d.doctor.nameEn).join(", ") || "—"}
                </td>
                <td className="px-4 py-3 text-end">
                  <Link href={`/admin/conditions/${condition.id}`} className="rounded-full border border-line px-3 py-1 text-xs">
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
