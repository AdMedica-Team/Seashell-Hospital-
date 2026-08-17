import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { requireRole } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { JobForm } from "@/components/admin/JobForm";
import type { JobOpening } from "@/generated/prisma/client";

export default async function EditJobPage({
  params,
}: PageProps<"/[locale]/admin/careers/[id]">) {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  const { id } = await params;

  const job = await prisma.jobOpening.findUnique({ where: { id } });
  if (!job) notFound();

  return <EditJobContent job={job} />;
}

function EditJobContent({ job }: { job: JobOpening }) {
  const t = useTranslations("admin.common");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl text-ink">
        {t("edit")} · {job.titleEn}
      </h1>
      <div className="mt-6">
        <JobForm job={job} />
      </div>
    </div>
  );
}
