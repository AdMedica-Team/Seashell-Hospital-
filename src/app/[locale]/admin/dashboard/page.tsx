import { useTranslations } from "next-intl";
import { verifySession } from "@/lib/dal";

export default async function AdminDashboardPage() {
  const session = await verifySession();

  return <DashboardContent user={session.user} />;
}

function DashboardContent({
  user,
}: {
  user: { name?: string | null; email?: string | null; role: string };
}) {
  const t = useTranslations("admin.dashboard");

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl text-ink">
        {t("welcome", { name: user.name ?? "" })}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {t("signedInAs", { email: user.email ?? "", role: user.role })}
      </p>
      <p className="mt-6 text-sm text-muted">{t("comingSoon")}</p>
    </div>
  );
}
