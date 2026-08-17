import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { Link } from "@/i18n/navigation";
import type { JobOpening } from "@/generated/prisma/client";

export default async function AdminCareersPage() {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  const jobs = await prisma.jobOpening.findMany({ orderBy: { postedAt: "desc" } });

  return <JobsList jobs={jobs} />;
}

function JobsList({ jobs }: { jobs: JobOpening[] }) {
  const t = useTranslations("admin.careers");
  const tc = useTranslations("admin.common");

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">{t("title")}</h1>
        <Link href="/admin/careers/new" className="rounded-full bg-teal px-4 py-2 text-sm font-medium text-white">
          {t("newJob")}
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
        <table className="w-full text-start text-sm">
          <thead className="bg-mint text-xs uppercase text-teal">
            <tr>
              <th className="px-4 py-3 text-start">{t("colTitle")}</th>
              <th className="px-4 py-3 text-start">{t("colStatus")}</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-t border-line">
                <td className="px-4 py-3">
                  {job.titleEn} <span className="text-muted">· {job.titleAr}</span>
                </td>
                <td className="px-4 py-3">
                  {job.isOpen ? (
                    <span className="text-teal">{t("open")}</span>
                  ) : (
                    <span className="text-red-600">{t("closed")}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-end">
                  <Link href={`/admin/careers/${job.id}`} className="rounded-full border border-line px-3 py-1 text-xs">
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
