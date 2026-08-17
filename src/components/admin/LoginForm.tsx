"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { loginAction } from "@/lib/actions/login";

export function LoginForm({ locale }: { locale: string }) {
  const t = useTranslations("admin.login");
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <form action={action} className="flex w-full max-w-sm flex-col gap-4">
      <input type="hidden" name="locale" value={locale} />
      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("email")}
        <input
          name="email"
          type="email"
          required
          className="rounded-lg border border-line px-3 py-2 outline-none"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("password")}
        <input
          name="password"
          type="password"
          required
          className="rounded-lg border border-line px-3 py-2 outline-none"
        />
      </label>
      {state?.error && <p className="text-sm text-red-600">{t("error")}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-teal px-6 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
