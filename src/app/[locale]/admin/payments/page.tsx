import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import type { PaymentTransaction } from "@/generated/prisma/client";

export default async function AdminPaymentsPage() {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  const transactions = await prisma.paymentTransaction.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  // Decimal isn't serializable across the RSC boundary — stringify amounts here.
  const rows = transactions.map((t) => ({ ...t, amount: t.amount.toString() }));
  return <PaymentsList rows={rows} />;
}

type Row = Omit<PaymentTransaction, "amount"> & { amount: string };

function PaymentsList({ rows }: { rows: Row[] }) {
  const t = useTranslations("admin.payments");
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-2xl text-ink">{t("title")}</h1>
      <p className="mt-1 text-sm text-muted">{t("readOnly")}</p>
      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
        <table className="w-full text-start text-sm">
          <thead className="bg-mint text-xs uppercase text-teal">
            <tr>
              <th className="px-4 py-3 text-start">{t("colReference")}</th>
              <th className="px-4 py-3 text-start">{t("colAmount")}</th>
              <th className="px-4 py-3 text-start">{t("colStatus")}</th>
              <th className="px-4 py-3 text-start">{t("colProvider")}</th>
              <th className="px-4 py-3 text-start">{t("colDate")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-line">
                <td className="px-4 py-3" dir="ltr">{row.referenceNumber}</td>
                <td className="px-4 py-3" dir="ltr">
                  {row.amount} {row.currency}
                </td>
                <td className="px-4 py-3">
                  {row.status === "PAID" ? t("statusPaid") : t("statusPending")}
                </td>
                <td className="px-4 py-3 text-muted">{row.providerName}</td>
                <td className="px-4 py-3 text-muted">
                  {new Date(row.createdAt).toLocaleDateString("en-GB")}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  {t("empty")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
