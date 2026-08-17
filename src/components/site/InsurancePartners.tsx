import Image from "next/image";
import { useTranslations } from "next-intl";
import { pick } from "@/lib/i18n-content";
import { INSURANCE_LOGOS, type InsuranceLogo } from "@/lib/insurance-logos";

/**
 * "Medical Insurance" logo wall on the home page — two rows of partner logos
 * scrolling in opposite directions ("train" motion), pausing on hover. The
 * animation is pure CSS (see globals.css .marquee-*), so this stays a sync
 * server component. Each row renders its logos twice for a seamless loop.
 */
export function InsurancePartners({ locale }: { locale: string }) {
  const t = useTranslations("insurancePartners");

  const half = Math.ceil(INSURANCE_LOGOS.length / 2);
  const rowOne = INSURANCE_LOGOS.slice(0, half);
  const rowTwo = INSURANCE_LOGOS.slice(half);

  return (
    <section className="overflow-hidden bg-white px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">{t("heading")}</h2>
          <p className="mx-auto mt-4 max-w-3xl text-ink/70">{t("body")}</p>
        </div>
      </div>

      <div className="mt-10 space-y-5 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <MarqueeRow logos={rowOne} locale={locale} />
        <MarqueeRow logos={rowTwo} locale={locale} reverse duration="55s" />
      </div>

      <p className="mt-8 text-center text-sm text-muted">{t("note")}</p>
    </section>
  );
}

function MarqueeRow({
  logos,
  locale,
  reverse = false,
  duration = "45s",
}: {
  logos: InsuranceLogo[];
  locale: string;
  reverse?: boolean;
  duration?: string;
}) {
  // Duplicated so a -50% translate loops seamlessly.
  const loop = [...logos, ...logos];
  return (
    <div className="marquee-viewport overflow-hidden">
      <ul
        className={`marquee-track ${reverse ? "marquee-track-reverse" : ""}`}
        style={{ ["--marquee-duration" as string]: duration }}
      >
        {loop.map((partner, i) => {
          const name = pick(partner.en, partner.ar, locale);
          return (
            <li
              key={`${partner.src}-${i}`}
              className="mx-2.5 flex h-24 w-44 shrink-0 items-center justify-center rounded-xl border border-line bg-white p-4"
              aria-hidden={i >= logos.length ? true : undefined}
            >
              <Image
                src={partner.src}
                alt={name}
                title={name}
                width={200}
                height={90}
                className="h-full w-auto max-w-full object-contain"
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
