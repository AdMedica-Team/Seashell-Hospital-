import { useTranslations } from "next-intl";

function PatientsIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" stroke={color} strokeWidth="1.6" aria-hidden>
      <path
        d="M20 5c-7 0-12.5 5.4-12.5 12 0 9 12.5 18 12.5 18s12.5-9 12.5-18C32.5 10.4 27 5 20 5Z"
        strokeLinejoin="round"
      />
      <path d="M20 12v10M15 17h10" strokeLinecap="round" />
    </svg>
  );
}

function ProfessionalsIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" stroke={color} strokeWidth="1.6" aria-hidden>
      <rect x="7" y="10" width="26" height="24" rx="1.5" />
      <path d="M15 10V6h10v4" />
      <path d="M20 16v8M16 20h8" strokeLinecap="round" />
    </svg>
  );
}

function PartnersIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" stroke={color} strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <circle cx="28" cy="12" r="4" />
      <circle cx="20" cy="30" r="4" />
      <path d="M15 14.5 18 26M25 14.5 22 26M16 12h8" strokeLinecap="round" />
    </svg>
  );
}

const GRADIENT_COLORS = ["#0090d7", "#4d5fa0", "#1f396b"];

export function OurCommitment() {
  const t = useTranslations("ourCommitment");

  const groups = [
    { Icon: PatientsIcon, title: t("patientsTitle"), body: t("patientsBody") },
    { Icon: ProfessionalsIcon, title: t("professionalsTitle"), body: t("professionalsBody") },
    { Icon: PartnersIcon, title: t("partnersTitle"), body: t("partnersBody") },
  ];

  return (
    <section className="bg-mint px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-3xl text-ink sm:text-4xl">{t("heading")}</h2>

        <div className="mt-10 h-[3px] w-full rounded-full bg-[linear-gradient(90deg,#0090d7_0%,#4d5fa0_50%,#1f396b_100%)] rtl:bg-[linear-gradient(270deg,#0090d7_0%,#4d5fa0_50%,#1f396b_100%)]" />

        <div className="grid gap-8 sm:grid-cols-3 sm:divide-x sm:divide-teal/25">
          {groups.map((g, i) => (
            <div key={g.title} className="pt-6 sm:ps-8 sm:first:ps-0">
              <g.Icon color={GRADIENT_COLORS[i]} />
              <h3 className="mt-4 font-display text-lg text-ink">{g.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{g.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
