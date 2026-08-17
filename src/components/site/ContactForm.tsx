"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { submitContactMessageAction } from "@/lib/actions/contact";

export function ContactForm() {
  const t = useTranslations("pages.contact");
  const [state, action, pending] = useActionState(submitContactMessageAction, undefined);

  if (state?.success) {
    return <p className="rounded-xl border border-line bg-mint p-4 text-sm text-ink">{t("formSuccess")}</p>;
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("formName")}
        <input name="name" required className="rounded-lg border border-line px-3 py-2" />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("formEmail")}
        <input name="email" type="email" required className="rounded-lg border border-line px-3 py-2" />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("formPhone")}
        <input name="phone" className="rounded-lg border border-line px-3 py-2" />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("formMessage")}
        <textarea name="message" required rows={4} className="rounded-lg border border-line px-3 py-2" />
      </label>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-fit rounded-full bg-teal px-6 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {t("formSubmit")}
      </button>
    </form>
  );
}
