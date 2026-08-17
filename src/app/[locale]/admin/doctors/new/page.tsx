import { useTranslations } from "next-intl";
import { requireRole } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { DoctorForm } from "@/components/admin/DoctorForm";

export default async function NewDoctorPage() {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  const departments = await prisma.department.findMany({ orderBy: { order: "asc" } });

  return <NewDoctorContent departments={departments} />;
}

function NewDoctorContent({ departments }: { departments: Awaited<ReturnType<typeof prisma.department.findMany>> }) {
  const t = useTranslations("admin.doctors");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl text-ink">{t("newDoctor")}</h1>
      <div className="mt-6">
        <DoctorForm departments={departments} />
      </div>
    </div>
  );
}
