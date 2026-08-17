import { useTranslations } from "next-intl";
import { requireRole } from "@/lib/dal";
import { getSiteSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";
import type { SiteSettings } from "@/generated/prisma/client";

export default async function AdminSettingsPage() {
  await requireRole(["MARKETING_ADMIN", "SUPER_ADMIN"]);
  const settings = await getSiteSettings();

  return <SettingsContent settings={settings} />;
}

function SettingsContent({ settings }: { settings: SiteSettings }) {
  const t = useTranslations("admin.settings");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl text-ink">{t("title")}</h1>
      <div className="mt-6">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
