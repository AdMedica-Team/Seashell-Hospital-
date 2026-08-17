import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function CalculatorsIndexPage() {
  const t = useTranslations("pages.calculators");

  const items = [
    { href: "/calculators/bmi", title: t("bmiTitle"), desc: t("bmiDesc") },
    { href: "/calculators/bmr", title: t("bmrTitle"), desc: t("bmrDesc") },
    { href: "/calculators/body-fat", title: t("bodyFatTitle"), desc: t("bodyFatDesc") },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="font-display text-xs font-bold uppercase tracking-wide text-teal">{t("eyebrow")}</p>
      <h1 className="mt-2 font-display text-4xl text-ink">{t("heading")}</h1>
      <p className="mt-3 text-muted">{t("intro")}</p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href as never}
            className="rounded-2xl border border-line bg-white p-5 hover:border-teal"
          >
            <h3 className="font-display text-lg text-ink">{item.title}</h3>
            <p className="mt-2 text-sm text-muted">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
