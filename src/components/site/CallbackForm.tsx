"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { submitCallbackAction } from "@/lib/actions/callback";

export function CallbackForm() {
  const t = useTranslations("pages.callback");
  const [state, action, pending] = useActionState(submitCallbackAction, undefined);

  const errorKey = state?.error
    ? (
        {
          invalid: "errorInvalid",
          invalidCode: "errorInvalidCode",
          expired: "errorExpired",
          tooMany: "errorTooMany",
          wrongCode: "errorWrongCode",
        } as const
      )[state.error as "invalid" | "invalidCode" | "expired" | "tooMany" | "wrongCode"]
    : undefined;

  if (state?.step === "done") {
    return (
      <div className="rounded-2xl border border-line bg-mint p-5 text-sm text-ink">
        <p className="font-display text-base">{t("successTitle")}</p>
        <p className="mt-1 text-ink/80">{t("successBody", { name: state.name ?? "" })}</p>
      </div>
    );
  }

  if (state?.step === "verify") {
    return (
      <form action={action} className="flex flex-col gap-3">
        <input type="hidden" name="intent" value="verify" />
        <input type="hidden" name="name" value={state.name ?? ""} />
        <input type="hidden" name="phone" value={state.phone ?? ""} />

        <p className="text-sm text-ink/80">{t("verifyIntro", { phone: state.phone ?? "" })}</p>

        {state.devCode && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            {t("devCodeNotice", { code: state.devCode })}
          </p>
        )}

        <label className="flex flex-col gap-1 text-sm text-ink">
          {t("code")}
          <input
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{6}"
            maxLength={6}
            required
            className="w-40 rounded-lg border border-line px-3 py-2 tracking-[0.4em]"
          />
        </label>

        {errorKey && <p className="text-sm text-red-600">{t(errorKey)}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 w-fit rounded-full bg-teal px-6 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {pending ? t("verifying") : t("verify")}
        </button>
      </form>
    );
  }

  // Step 1 — request the code.
  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="intent" value="request" />

      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("name")}
        <input name="name" required className="rounded-lg border border-line px-3 py-2" />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("phone")}
        <input
          name="phone"
          type="tel"
          required
          className="rounded-lg border border-line px-3 py-2"
        />
      </label>

      {errorKey && <p className="text-sm text-red-600">{t(errorKey)}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-fit rounded-full bg-teal px-6 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? t("sending") : t("sendCode")}
      </button>
    </form>
  );
}
