import { HeroPremium } from "@/components/site/HeroPremium";
import { ClinicalExcellence } from "@/components/site/ClinicalExcellence";
import { LetUsHelp } from "@/components/site/LetUsHelp";
import { OurCommitment } from "@/components/site/OurCommitment";
import { OurFacilities } from "@/components/site/OurFacilities";
import { QuickActionCards } from "@/components/site/QuickActionCards";
import { InsurancePartners } from "@/components/site/InsurancePartners";
import { SpecialtiesList } from "@/components/site/SpecialtiesList";

export default async function HomePage({
  params,
}: PageProps<"/[locale]">) {
  const { locale } = await params;

  return <HomeContent locale={locale} />;
}

function HomeContent({ locale }: { locale: string }) {
  return (
    <div className="flex flex-col">
      {/* Premium dark hero */}
      <HeroPremium />

      <QuickActionCards />

      <LetUsHelp />

      <ClinicalExcellence locale={locale} />

      <SpecialtiesList locale={locale} />

      <InsurancePartners locale={locale} />

      <OurCommitment />

      <OurFacilities />
    </div>
  );
}
