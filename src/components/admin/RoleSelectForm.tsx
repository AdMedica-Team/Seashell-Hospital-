"use client";

import { useTranslations } from "next-intl";
import type { Role } from "@/generated/prisma/client";
import { updateUserRoleAction } from "@/lib/actions/users";

export function RoleSelectForm({ userId, role }: { userId: string; role: Role }) {
  const t = useTranslations("admin.users");
  const action = updateUserRoleAction.bind(null, userId);

  return (
    <form action={action}>
      <select
        name="role"
        defaultValue={role}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="rounded-md border border-line px-2 py-1 text-xs"
      >
        <option value="CONTENT_EDITOR">{t("roleContentEditor")}</option>
        <option value="MARKETING_ADMIN">{t("roleMarketingAdmin")}</option>
        <option value="SUPER_ADMIN">{t("roleSuperAdmin")}</option>
      </select>
    </form>
  );
}
