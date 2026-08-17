"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { createUserAction } from "@/lib/actions/users";

export function CreateUserForm() {
  const t = useTranslations("admin.newUser");
  const tRoles = useTranslations("admin.users");
  const [state, action, pending] = useActionState(createUserAction, undefined);

  return (
    <form action={action} className="flex max-w-md flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("name")}
        <input name="name" required className="rounded-lg border border-line px-3 py-2" />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("email")}
        <input name="email" type="email" required className="rounded-lg border border-line px-3 py-2" />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("password")}
        <input name="password" type="password" required minLength={8} className="rounded-lg border border-line px-3 py-2" />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("role")}
        <select name="role" required className="rounded-lg border border-line px-3 py-2" defaultValue="CONTENT_EDITOR">
          <option value="CONTENT_EDITOR">{tRoles("roleContentEditor")}</option>
          <option value="MARKETING_ADMIN">{tRoles("roleMarketingAdmin")}</option>
          <option value="SUPER_ADMIN">{tRoles("roleSuperAdmin")}</option>
        </select>
      </label>
      {state?.error && <p className="text-sm text-red-600">{t("error")}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-fit rounded-full bg-teal px-6 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
