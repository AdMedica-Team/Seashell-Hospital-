import { useTranslations } from "next-intl";
import { requireRole } from "@/lib/dal";
import { LeadershipForm } from "@/components/admin/LeadershipForm";

export default async function NewLeadershipPage() {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  return <NewLeadershipContent />;
}

function NewLeadershipContent() {
  const t = useTranslations("admin.leadership");
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl text-ink">{t("newMember")}</h1>
      <div className="mt-6">
        <LeadershipForm />
      </div>
    </div>
  );
}
