import { useTranslations } from "next-intl";
import { getSiteSettings } from "@/lib/settings";
import { Link } from "@/i18n/navigation";

export async function TopBar() {
  const settings = await getSiteSettings();
  return <TopBarContent emergencyNumber={settings.emergencyNumber} />;
}

function TopBarContent({ emergencyNumber }: { emergencyNumber: string }) {
  const t = useTranslations("topbar");
  const tn = useTranslations("nav");

  return (
    <div className="bg-mint text-ink">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 text-sm sm:px-6">
        {/* Secondary links */}
        <nav className="hidden items-center gap-5 md:flex">
          <Link href="/about" className="hover:text-teal">
            {tn("about")}
          </Link>
          <Link href="/news" className="hover:text-teal">
            {tn("news")}
          </Link>
          <Link href="/careers" className="hover:text-teal">
            {tn("careers")}
          </Link>
        </nav>

        {/* Quick actions */}
        <div className="flex items-center gap-5 ms-auto md:ms-0">
          <Link href="/appointment" className="flex items-center gap-1.5 hover:text-teal">
            <span aria-hidden>🗓️</span>
            {t("appointments")}
          </Link>
          <a
            href={`tel:${emergencyNumber}`}
            className="flex items-center gap-1.5 font-semibold text-teal"
          >
            <span aria-hidden>🚑</span>
            {t("emergency")}
          </a>
        </div>
      </div>
    </div>
  );
}
