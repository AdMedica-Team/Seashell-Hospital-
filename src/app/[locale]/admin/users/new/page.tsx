import { useTranslations } from "next-intl";
import { requireRole } from "@/lib/dal";
import { CreateUserForm } from "@/components/admin/CreateUserForm";

export default async function NewUserPage() {
  await requireRole(["SUPER_ADMIN"]);

  return <NewUserContent />;
}

function NewUserContent() {
  const t = useTranslations("admin.newUser");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl text-ink">{t("title")}</h1>
      <p className="mt-1 text-sm text-muted">{t("subtitle")}</p>
      <div className="mt-6">
        <CreateUserForm />
      </div>
    </div>
  );
}
