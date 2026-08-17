import { useTranslations } from "next-intl";
import { pick } from "@/lib/i18n-content";
import { SPECIALTIES } from "@/lib/specialties-list";

/**
 * "Specialties" section — the full list of medical specialties on a blue
 * gradient, laid out in up to four columns (matching the client reference).
 * Sync server component (uses useTranslations, never async).
 */
export function SpecialtiesList({ locale }: { locale: string }) {
  const t = useTranslations("specialties");

  return (
    <section className="bg-[linear-gradient(180deg,#0a86d8_0%,#0f5aa6_45%,#0c2f5e_100%)] px-4 py-16 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-3xl sm:text-4xl">{t("heading")}</h2>

        <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {SPECIALTIES.map((s) => (
            <li key={s.en} className="text-white/90 transition hover:text-white">
              {pick(s.en, s.ar, locale)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
