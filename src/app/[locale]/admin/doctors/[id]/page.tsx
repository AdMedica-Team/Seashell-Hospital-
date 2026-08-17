import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { requireRole } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { DoctorForm } from "@/components/admin/DoctorForm";
import type { Doctor, DoctorDepartment, Department } from "@/generated/prisma/client";

export default async function EditDoctorPage({
  params,
}: PageProps<"/[locale]/admin/doctors/[id]">) {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  const { id } = await params;

  const [doctor, departments] = await Promise.all([
    prisma.doctor.findUnique({ where: { id }, include: { departments: true } }),
    prisma.department.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!doctor) notFound();

  return <EditDoctorContent doctor={doctor} departments={departments} />;
}

function EditDoctorContent({
  doctor,
  departments,
}: {
  doctor: Doctor & { departments: DoctorDepartment[] };
  departments: Department[];
}) {
  const t = useTranslations("admin.common");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl text-ink">
        {t("edit")} · {doctor.nameEn}
      </h1>
      <div className="mt-6">
        <DoctorForm doctor={doctor} departments={departments} />
      </div>
    </div>
  );
}
