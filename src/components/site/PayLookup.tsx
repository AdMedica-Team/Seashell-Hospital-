"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { lookupPaymentAction } from "@/lib/actions/payments";

export function PayLookup() {
  const t = useTranslations("pages.pay");
  const [state, action, pending] = useActionState(lookupPaymentAction, undefined);

  return (
    <div className="flex flex-col gap-6">
      <form action={action} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {t("reference")}
          <input
            name="reference"
            required
            placeholder={t("referencePlaceholder")}
            className="rounded-lg border border-line px-3 py-2"
          />
          <span className="text-xs text-muted">{t("referenceHint")}</span>
        </label>
        {state?.status === "error" && <p className="text-sm text-red-600">{t("errorInvalid")}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-fit rounded-full bg-teal px-6 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {pending ? t("looking") : t("lookup")}
        </button>
      </form>

      {state?.status === "notFound" && (
        <p className="rounded-2xl border border-line bg-white p-4 text-sm text-ink/80">
          {t("notFound", { reference: state.reference ?? "" })}
        </p>
      )}

      {state?.status === "found" && state.bill && (
        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">{t("reference")}</span>
            <span dir="ltr" className="font-medium text-ink">{state.bill.referenceNumber}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
            <span className="text-sm text-muted">{t("amount")}</span>
            <span dir="ltr" className="font-display text-2xl text-ink">
              {state.bill.amount} {state.bill.currency}
            </span>
          </div>
          {state.bill.payerName && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-muted">{t("payer")}</span>
              <span className="text-ink">{state.bill.payerName}</span>
            </div>
          )}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-muted">{t("statusLabel")}</span>
            <span className="text-ink">
              {state.bill.status === "PAID" ? t("statusPaid") : t("statusUnpaid")}
            </span>
          </div>

          {state.bill.status === "PAID" ? (
            <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {t("alreadyPaid")}
            </p>
          ) : (
            // Gateway not wired yet — instruct in-person payment. Once a provider is
            // configured, swap this notice for the hosted-checkout hand-off.
            <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {t("providerPending")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
