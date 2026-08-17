import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BmiCalculator } from "@/components/calculators/BmiCalculator";

export default function BmiCalculatorPage() {
  const t = useTranslations("pages.calculators");

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <Link href="/calculators" className="text-sm text-teal">
        {t("backToCalculators")}
      </Link>
      <h1 className="mt-4 font-display text-3xl text-ink">{t("bmiTitle")}</h1>
      <p className="mt-2 text-sm text-muted">{t("bmiDesc")}</p>
      <div className="mt-8">
        <BmiCalculator />
      </div>
    </div>
  );
}
