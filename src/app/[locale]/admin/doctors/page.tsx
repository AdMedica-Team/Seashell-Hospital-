import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { Link } from "@/i18n/navigation";
import type { Doctor } from "@/generated/prisma/client";

export default async function AdminDoctorsPage() {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  const doctors = await prisma.doctor.findMany({
    orderBy: { nameEn: "asc" },
    include: { departments: { include: { department: true } } },
  });

  return <DoctorsList doctors={doctors} />;
}

function DoctorsList({
  doctors,
}: {
  doctors: (Doctor & { departments: { department: { nameEn: string } }[] })[];
}) {
  const t = useTranslations("admin.doctors");
  const tc = useTranslations("admin.common");

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">{t("title")}</h1>
        <Link href="/admin/doctors/new" className="rounded-full bg-teal px-4 py-2 text-sm font-medium text-white">
          {t("newDoctor")}
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
        <table className="w-full text-start text-sm">
          <thead className="bg-mint text-xs uppercase text-teal">
            <tr>
              <th className="px-4 py-3 text-start">{t("colName")}</th>
              <th className="px-4 py-3 text-start">{t("colDepartments")}</th>
              <th className="px-4 py-3 text-start">{t("colFeatured")}</th>
              <th className="px-4 py-3 text-start">{t("colPublished")}</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc.id} className="border-t border-line">
                <td className="px-4 py-3">
                  {doc.nameEn} <span className="text-muted">· {doc.nameAr}</span>
                </td>
                <td className="px-4 py-3 text-muted">
                  {doc.departments.map((d) => d.department.nameEn).join(", ") || "—"}
                </td>
                <td className="px-4 py-3">{doc.isFeatured ? tc("yes") : tc("no")}</td>
                <td className="px-4 py-3">{doc.isPublished ? tc("yes") : tc("no")}</td>
                <td className="px-4 py-3 text-end">
                  <Link href={`/admin/doctors/${doc.id}`} className="rounded-full border border-line px-3 py-1 text-xs">
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
