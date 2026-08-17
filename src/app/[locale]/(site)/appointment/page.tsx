import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { AppointmentForm } from "@/components/site/AppointmentForm";

export default async function AppointmentPage({
  params,
  searchParams,
}: PageProps<"/[locale]/appointment">) {
  const { locale } = await params;
  const { department } = await searchParams;
  const departmentSlug = typeof department === "string" ? department : undefined;

  const departments = await prisma.department.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    select: { id: true, slug: true, nameEn: true, nameAr: true },
  });

  const defaultDepartmentId = departmentSlug
    ? departments.find((d) => d.slug === departmentSlug)?.id
    : undefined;

  return (
    <AppointmentContent
      departments={departments}
      defaultDepartmentId={defaultDepartmentId}
      locale={locale}
    />
  );
}

function AppointmentContent({
  departments,
  defaultDepartmentId,
  locale,
}: {
  departments: { id: string; slug: string; nameEn: string; nameAr: string }[];
  defaultDepartmentId?: string;
  locale: string;
}) {
  const t = useTranslations("pages.appointment");

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <p className="font-display text-xs font-bold uppercase tracking-wide text-teal">{t("eyebrow")}</p>
      <h1 className="mt-2 font-display text-3xl text-ink">{t("heading")}</h1>
      <p className="mt-2 text-sm text-muted">{t("subtext")}</p>
      <div className="mt-8">
        <AppointmentForm
          departments={departments}
          defaultDepartmentId={defaultDepartmentId}
          locale={locale}
        />
      </div>
    </div>
  );
}
