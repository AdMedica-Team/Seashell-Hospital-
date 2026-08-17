import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import type { Role } from "@/generated/prisma/client";
import { Link } from "@/i18n/navigation";
import { toggleUserActiveAction } from "@/lib/actions/users";
import { RoleSelectForm } from "@/components/admin/RoleSelectForm";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  lastLoginAt: Date | null;
};

export default async function UsersPage() {
  await requireRole(["SUPER_ADMIN"]);
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
    },
  });

  return <UsersTable users={users} />;
}

function UsersTable({ users }: { users: UserRow[] }) {
  const t = useTranslations("admin.users");

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">{t("title")}</h1>
        <Link
          href="/admin/users/new"
          className="rounded-full bg-teal px-4 py-2 text-sm font-medium text-white"
        >
          {t("newUser")}
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
        <table className="w-full text-start text-sm">
          <thead className="bg-mint text-xs uppercase text-teal">
            <tr>
              <th className="px-4 py-3 text-start">{t("colName")}</th>
              <th className="px-4 py-3 text-start">{t("colEmail")}</th>
              <th className="px-4 py-3 text-start">{t("colRole")}</th>
              <th className="px-4 py-3 text-start">{t("colStatus")}</th>
              <th className="px-4 py-3 text-start">{t("colLastLogin")}</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-line">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3 text-muted">{user.email}</td>
                <td className="px-4 py-3">
                  <RoleSelectForm userId={user.id} role={user.role} />
                </td>
                <td className="px-4 py-3">
                  {user.isActive ? (
                    <span className="text-teal">{t("statusActive")}</span>
                  ) : (
                    <span className="text-red-600">{t("statusDisabled")}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted">
                  {user.lastLoginAt
                    ? new Date(user.lastLoginAt).toLocaleString()
                    : t("never")}
                </td>
                <td className="px-4 py-3 text-end">
                  <form action={toggleUserActiveAction.bind(null, user.id)}>
                    <button
                      type="submit"
                      className="rounded-full border border-line px-3 py-1 text-xs"
                    >
                      {user.isActive ? t("disable") : t("enable")}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
