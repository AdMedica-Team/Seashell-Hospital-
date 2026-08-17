import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { updateAppointmentStatusAction } from "@/lib/actions/appointments";
import type { Prisma } from "@/generated/prisma/client";

export default async function AdminAppointmentsPage() {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  const requests = await prisma.appointmentRequest.findMany({
    orderBy: { createdAt: "desc" },
  });
  const departments = await prisma.department.findMany({
    select: { id: true, nameEn: true },
  });
  const deptMap = new Map(departments.map((d) => [d.id, d.nameEn]));

  return <AppointmentsList requests={requests} deptMap={deptMap} />;
}

type AppointmentRow = Prisma.AppointmentRequestGetPayload<Record<string, never>>;

function AppointmentsList({
  requests,
  deptMap,
}: {
  requests: AppointmentRow[];
  deptMap: Map<string, string>;
}) {
  const t = useTranslations("admin.appointments");

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl text-ink">{t("title")}</h1>
      <div className="mt-6 flex flex-col gap-3">
        {requests.length === 0 && <p className="text-sm text-muted">{t("empty")}</p>}
        {requests.map((req) => (
          <div key={req.id} className="rounded-xl border border-line bg-white p-4 text-sm">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>
                {t("from")}: {req.name} ({req.phone})
              </span>
              <span>{new Date(req.createdAt).toLocaleString()}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-ink/80">
              {req.departmentId && (
                <span>
                  {t("department")}: {deptMap.get(req.departmentId) ?? "—"}
                </span>
              )}
              {req.preferredDate && (
                <span>
                  {t("preferredDate")}: {new Date(req.preferredDate).toLocaleDateString()}
                </span>
              )}
            </div>
            {req.notes && <p className="mt-2 text-ink">{req.notes}</p>}
            <div className="mt-3 flex items-center gap-3">
              <span
                className={
                  req.status === "PENDING"
                    ? "text-amber-600"
                    : req.status === "CONTACTED"
                      ? "text-teal"
                      : "text-muted"
                }
              >
                {req.status === "PENDING"
                  ? t("statusPending")
                  : req.status === "CONTACTED"
                    ? t("statusContacted")
                    : t("statusClosed")}
              </span>
              {req.status !== "CONTACTED" && (
                <form action={updateAppointmentStatusAction.bind(null, req.id, "CONTACTED")}>
                  <button type="submit" className="rounded-full border border-line px-3 py-1 text-xs">
                    {t("markContacted")}
                  </button>
                </form>
              )}
              {req.status !== "CLOSED" && (
                <form action={updateAppointmentStatusAction.bind(null, req.id, "CLOSED")}>
                  <button type="submit" className="rounded-full border border-line px-3 py-1 text-xs">
                    {t("markClosed")}
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
