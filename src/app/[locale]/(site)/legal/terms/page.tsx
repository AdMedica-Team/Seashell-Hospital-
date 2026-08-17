import { useTranslations } from "next-intl";
import { LegalDocument } from "@/components/site/LegalDocument";

export default function TermsPage() {
  return <TermsContent />;
}

function TermsContent() {
  const t = useTranslations("pages.legal.terms");
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
