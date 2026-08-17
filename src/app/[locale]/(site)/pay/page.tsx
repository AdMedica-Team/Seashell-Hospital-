import { useTranslations } from "next-intl";
import { PayLookup } from "@/components/site/PayLookup";

export default function PayPage() {
  return <PayContent />;
}

function PayContent() {
  const t = useTranslations("pages.pay");
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <p className="font-display text-xs font-bold uppercase tracking-wide text-teal">
        {t("eyebrow")}
      </p>
      <h1 className="mt-2 font-display text-4xl text-ink">{t("heading")}</h1>
      <p className="mt-4 text-ink/80">{t("intro")}</p>
      <div className="mt-8">
        <PayLookup />
      </div>
    </div>
  );
}
