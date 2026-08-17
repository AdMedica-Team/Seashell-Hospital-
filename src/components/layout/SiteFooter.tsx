import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSiteSettings } from "@/lib/settings";
import { SOCIAL_LINKS } from "@/lib/hospital-info";

export async function SiteFooter() {
  const [t, settings] = await Promise.all([
    getTranslations("footer"),
    getSiteSettings(),
  ]);

  const tel = settings.hotlineNumber;
  const socials = [
    { href: SOCIAL_LINKS.linkedin, label: "LinkedIn", icon: <LinkedInIcon /> },
    { href: SOCIAL_LINKS.x, label: "X", icon: <XIcon /> },
    { href: SOCIAL_LINKS.youtube, label: "YouTube", icon: <YouTubeIcon /> },
    { href: SOCIAL_LINKS.facebook, label: "Facebook", icon: <FacebookIcon /> },
    { href: SOCIAL_LINKS.instagram, label: "Instagram", icon: <InstagramIcon /> },
  ];

  return (
    <footer className="mt-16 bg-[#152a55] text-white [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:22px_22px]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-8 sm:px-6 md:grid-cols-3">
        {/* Call centre */}
        <div className="flex items-center justify-center gap-3 md:justify-start">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[linear-gradient(160deg,#1fb0e0,#0a6fae)] text-center shadow-lg">
            <HeadsetIcon />
          </span>
          <div className="leading-tight">
            <p className="text-xs font-medium uppercase tracking-wider text-white/70">
              {t("support24")}
            </p>
            <a href={`tel:${tel.replace(/\s+/g, "")}`} dir="ltr" className="text-3xl font-bold">
              {tel}
            </a>
          </div>
        </div>

        {/* Tagline */}
        <div className="text-center">
          <p className="font-display text-3xl italic tracking-wide sm:text-4xl">
            {t("tagline")}
          </p>
        </div>

        {/* Socials + copyright */}
        <div className="flex flex-col items-center gap-3 md:items-end">
          <ul className="flex items-center gap-3">
            {socials.map((s) => {
              const isReal = s.href && s.href !== "#";
              const cls =
                "grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-[#152a55]";
              return (
                <li key={s.label}>
                  {isReal ? (
                    <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className={cls}>
                      {s.icon}
                    </a>
                  ) : (
                    <span aria-label={s.label} className={cls}>
                      {s.icon}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="text-center text-xs text-white/75 md:text-end">
            {t("rights", { year: 2026 })}
          </p>
          <p className="text-center text-xs text-white/55 md:text-end">{t("studio")}</p>
        </div>
      </div>

      {/* Keep the legal links reachable from every page. */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-3 text-xs text-white/70 sm:px-6">
          <Link href="/legal/privacy" className="hover:text-white">
            {t("privacy")}
          </Link>
          <Link href="/legal/terms" className="hover:text-white">
            {t("terms")}
          </Link>
          <Link href="/anti-fraud-notice" className="hover:text-white">
            {t("antiFraud")}
          </Link>
        </div>
      </div>
    </footer>
  );
}

function HeadsetIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="white" strokeWidth="1.8" aria-hidden>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" strokeLinecap="round" />
      <rect x="2.5" y="13" width="4" height="6" rx="1.5" fill="white" stroke="none" />
      <rect x="17.5" y="13" width="4" height="6" rx="1.5" fill="white" stroke="none" />
      <path d="M20 19v1a3 3 0 0 1-3 3h-3" strokeLinecap="round" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21H21v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H13V9Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M18.9 2H22l-7.6 8.7L23 22h-6.8l-5-6.6L5.5 22H2.4l8.1-9.3L1.5 2h7l4.5 6 5.9-6Zm-1.2 18h1.7L7.1 3.8H5.3L17.7 20Z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.7-1.7C19.4 5.2 12 5.2 12 5.2s-7.4 0-8.9.4a2.5 2.5 0 0 0-1.7 1.7C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.7 1.7c1.5.4 8.9.4 8.9.4s7.4 0 8.9-.4a2.5 2.5 0 0 0 1.7-1.7C23 15.2 23 12 23 12Zm-13 3V9l5.2 3-5.2 3Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
      <path d="M14 9h2.5l.5-3H14V4.5c0-.9.3-1.5 1.6-1.5H17V.3C16.7.2 15.8.1 14.8.1 12.5.1 11 1.5 11 4v2H8.5v3H11v9h3V9Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
