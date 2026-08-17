import { useTranslations } from "next-intl";
import { LegalDocument } from "@/components/site/LegalDocument";

export default function PrivacyPage() {
  return <PrivacyContent />;
}

function PrivacyContent() {
  const t = useTranslations("pages.legal.privacy");
  const sections = t.raw("sections") as { heading: string; body: string }[];
  return (
    <LegalDocument
      eyebrow={t("eyebrow")}
      heading={t("heading")}
      updated={t("updated")}
      draftNotice={t("draftNotice")}
      sections={sections}
    />
  );
}
