import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * Persistent quick-links column shown inside every mega-menu panel (SOW #6),
 * regardless of which top-level nav item triggered it. The emergency number
 * is CMS-editable (SiteSettings), passed down from the server-rendered
 * header rather than hardcoded.
 */
export function QuickLinksPanel({ emergencyNumber }: { emergencyNumber: string }) {
  const tNav = useTranslations("nav");
  const tTop = useTranslations("topbar");
  const tHome = useTranslations("home");

  return (
    <div className="flex w-full flex-col gap-3 border-line bg-mint p-5 sm:w-64 sm:border-s">
      <p className="font-display text-xs font-bold uppercase tracking-wide text-teal">
        {tNav("quickLinks")}
      </p>
      <a
        href={`tel:${emergencyNumber}`}
        className="text-sm font-semibold text-ink underline decoration-teal/50 underline-offset-4"
      >
        {tTop("emergencyLabel")} {emergencyNumber}
      </a>
      <Link
        href="/callback"
        className="rounded-full bg-teal px-4 py-2 text-center text-xs font-medium text-white"
      >
        {tNav("callback")}
      </Link>
      <Link
        href="/pay"
        className="rounded-full border border-line bg-white px-4 py-2 text-center text-xs font-medium text-ink"
      >
        {tNav("pay")}
      </Link>
      <Link
        href="/appointment"
        className="rounded-full border border-line bg-white px-4 py-2 text-center text-xs font-medium text-ink"
      >
        {tHome("bookCta")}
      </Link>
    </div>
  );
}
