import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon-flip h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ITEMS = [
  {
    key: "bookAppointment",
    href: "/appointment",
    bg: "linear-gradient(180deg, #eaf7ff 0%, #d9f1ff 55%, #c2e6fa 100%)",
  },
  {
    key: "findHospital",
    href: "/contact",
    bg: "linear-gradient(180deg, #d3edfb 0%, #b8e4f5 55%, #9ed8ee 100%)",
  },
  {
    key: "bookCheckup",
    href: "/appointment",
    bg: "linear-gradient(180deg, #b3ddf0 0%, #97d3ea 55%, #7bc6e3 100%)",
  },
  {
    key: "specialistOpinion",
    href: "/appointment",
    bg: "linear-gradient(180deg, #8fcbe6 0%, #74c0e0 55%, #57b2d9 100%)",
  },
] as const;

/**
 * Four-segment action pill overlaid on the bottom of the hero video, styled
 * with layered gradients/shadows for a raised, 3D button feel.
 */
export function HeroActionBar() {
  const t = useTranslations("actionBar");

  return (
    <div className="absolute inset-x-4 bottom-16 z-30 mx-auto hidden max-w-6xl overflow-hidden rounded-full shadow-[0_10px_30px_rgba(10,15,26,0.35)] sm:flex sm:divide-x sm:divide-ink/10">
      {ITEMS.map((item) => (
        <Link
          key={item.key}
          href={item.href as never}
          style={{ background: item.bg }}
          className="flex flex-1 items-center justify-between gap-3 whitespace-nowrap px-5 py-4 text-sm font-bold text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.06)] transition hover:brightness-95"
        >
          {t(item.key)}
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[linear-gradient(180deg,#2a4680_0%,#1f396b_60%,#16294f_100%)] text-white shadow-[0_2px_4px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.35)]">
            <ArrowIcon />
          </span>
        </Link>
      ))}
    </div>
  );
}
