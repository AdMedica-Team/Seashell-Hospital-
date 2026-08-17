import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { updateCallbackStatusAction } from "@/lib/actions/callback";
import type { CallbackRequest } from "@/generated/prisma/client";

export default async function AdminCallbackRequestsPage() {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  const requests = await prisma.callbackRequest.findMany({ orderBy: { createdAt: "desc" } });
  return <CallbackList requests={requests} />;
}

function CallbackList({ requests }: { requests: CallbackRequest[] }) {
  const t = useTranslations("admin.callbackRequests");

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
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {req.phoneVerified && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                  {t("verified")}
                </span>
              )}
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
                <form action={updateCallbackStatusAction.bind(null, req.id, "CONTACTED")}>
                  <button type="submit" className="rounded-full border border-line px-3 py-1 text-xs">
                    {t("markContacted")}
                  </button>
                </form>
              )}
              {req.status !== "CLOSED" && (
                <form action={updateCallbackStatusAction.bind(null, req.id, "CLOSED")}>
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
