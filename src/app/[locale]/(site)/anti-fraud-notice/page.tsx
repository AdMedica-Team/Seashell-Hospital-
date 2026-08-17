import { useTranslations } from "next-intl";
import { LegalDocument } from "@/components/site/LegalDocument";

export default function AntiFraudPage() {
  return <AntiFraudContent />;
}

function AntiFraudContent() {
  const t = useTranslations("pages.legal.antiFraud");
  const sections = t.raw("sections") as { heading: string; body: string }[];
  return (
    <LegalDocument
      eyebrow={t("eyebrow")}
      heading={t("heading")}
      updated={t("updated")}
      sections={sections}
    />
  );
}
