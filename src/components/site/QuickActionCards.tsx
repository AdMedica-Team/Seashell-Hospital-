"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { usePastHero } from "@/lib/use-past-hero";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon-flip h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HealthCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden>
      <path
        d="M12 3 4 6.5v6c0 4.2 3.5 6.8 8 8.5 4.5-1.7 8-4.3 8-8.5v-6L12 3Z"
        fill="#0090d7"
        stroke="#1f396b"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      <path d="M12 3 4 6.5v6c0 4.2 3.5 6.8 8 8.5V3Z" fill="#ffffff" fillOpacity="0.18" />
      <path
        d="M10.6 8.5h2.8v3.1H16v2.8h-2.6V17.5h-2.8v-3.1H8v-2.8h2.6V8.5Z"
        fill="#ffffff"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#1f396b" strokeWidth="2" aria-hidden>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

const TONES = [
  "bg-[linear-gradient(160deg,#eaf7ff_0%,#c2e6fa_100%)] shadow-[0_8px_18px_rgba(0,144,215,0.28),inset_0_1px_0_rgba(255,255,255,0.8)]",
  "bg-[linear-gradient(160deg,#eaf3ff_0%,#bccefb_100%)] shadow-[0_8px_18px_rgba(31,57,107,0.22),inset_0_1px_0_rgba(255,255,255,0.8)]",
] as const;

const CARDS = [
  {
    key: "bookAppointment",
    href: "/appointment",
    icon: <Image src="/icons/quick-appointment.webp" alt="" width={40} height={40} className="h-10 w-10 object-contain" />,
  },
  {
    key: "findHospital",
    href: "/contact",
    icon: <Image src="/icons/quick-hospital.png" alt="" width={40} height={40} className="h-10 w-10 object-contain" />,
  },
  { key: "bookHealthCheck", href: "/appointment", icon: <HealthCheckIcon /> },
  {
    key: "getExpertOpinion",
    href: "/appointment",
    icon: <Image src="/icons/quick-doctor.png" alt="" width={36} height={36} className="h-9 w-9 object-contain" />,
  },
  { key: "search", href: "/search", icon: <SearchIcon /> },
] as const;

/**
 * Floating rail of quick-action pills, pinned to the page edge and tracking
 * scroll — hidden while the homepage hero is in view so it never overlaps it,
 * revealed once the user scrolls past. Collapsed to just the icon by default;
 * hovering one expands only that pill to reveal its label and arrow button.
 */
export function QuickActionCards() {
  const t = useTranslations("quickAccess");
  const pastHero = usePastHero();

  return (
    <div
      className={`fixed start-4 top-1/2 z-40 transition-all duration-500 ease-out ${
        pastHero ? "translate-y-[-50%] opacity-100" : "translate-y-[-42%] opacity-0"
      } ${pastHero ? "" : "pointer-events-none"}`}
    >
      <div className="flex flex-col gap-3">
        {CARDS.map((card, i) => (
          <Link
            key={card.key}
            href={card.href as never}
            aria-label={t(card.key)}
            className={`group flex h-16 items-center self-start overflow-hidden rounded-full transition-all duration-300 hover:-translate-y-0.5 ${TONES[i % TONES.length]}`}
          >
            <span className="grid h-16 w-16 shrink-0 place-items-center">{card.icon}</span>
            <span className="max-w-0 overflow-hidden whitespace-nowrap font-display text-lg font-bold text-ink opacity-0 transition-all duration-300 group-hover:max-w-xs group-hover:opacity-100">
              {t(card.key)}
            </span>
            <span className="grid h-11 w-0 shrink-0 place-items-center rounded-full bg-[linear-gradient(180deg,#2a4680_0%,#1f396b_60%,#16294f_100%)] text-white opacity-0 shadow-[0_2px_4px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.35)] transition-all duration-300 group-hover:me-2.5 group-hover:w-11 group-hover:opacity-100">
              <ArrowIcon />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
