/**
 * Insurance / corporate partners we have brand logos for. Powers the homepage
 * "Medical Insurance" logo wall. Files live in /public/partners.
 *
 * This is the logo-backed subset; the full text list (including partners without
 * a logo) still lives in `insurance-partners.ts` and powers the chatbot.
 * To add a partner here: drop the logo in /public/partners and add a row below.
 */
export type InsuranceLogo = { src: string; en: string; ar: string };

export const INSURANCE_LOGOS: InsuranceLogo[] = [
  { src: "/partners/axa.jpg", en: "AXA", ar: "AXA" },
  { src: "/partners/nextcare.jpg", en: "Nextcare", ar: "Nextcare" },
  { src: "/partners/gig.jpg", en: "GIG", ar: "GIG" },
  { src: "/partners/care-plus.jpg", en: "Care Plus", ar: "Care Plus" },
  { src: "/partners/reliance-health.jpg", en: "Reliance Health", ar: "Reliance Health" },
  { src: "/partners/medmark.jpg", en: "Medmark", ar: "Medmark" },
  { src: "/partners/axon.jpg", en: "Axon", ar: "Axon" },
  { src: "/partners/future-healthcare.jpg", en: "Future Healthcare", ar: "Future Healthcare" },
  { src: "/partners/life-healthcare.jpg", en: "Life HealthCare", ar: "Life HealthCare" },
  { src: "/partners/limitless-care.jpg", en: "Limitless Care", ar: "Limitless Care" },
  { src: "/partners/medsure.jpg", en: "Medsure", ar: "Medsure" },
  { src: "/partners/al-mashreq.jpg", en: "Al Mashreq Insurance", ar: "المشرق للتأمين" },
  { src: "/partners/amc.jpg", en: "AMC – Al Ahly Medical Company", ar: "الأهلي للخدمات الطبية AMC" },
  { src: "/partners/egymed.jpg", en: "EGYMED – Egyptian Medical Services", ar: "المصرية للخدمات الطبية EGYMED" },
  { src: "/partners/egycare.jpg", en: "Egycare", ar: "Egycare" },
  { src: "/partners/sehatech.jpg", en: "SehaTech", ar: "صحة وان SehaTech" },
  { src: "/partners/al-riyadh.jpg", en: "Al Riyadh Medical Services", ar: "الرياض للخدمات الطبية" },
  { src: "/partners/dms.jpg", en: "DMS – Diamond Medical Services", ar: "dms Diamond Medical Services" },
  { src: "/partners/maak.jpg", en: "Maak.Egypt", ar: "Maak.Egypt" },
  { src: "/partners/swagrass.jpg", en: "Swagrass", ar: "Swagrass" },
  { src: "/partners/clinido.jpg", en: "ClinicDo", ar: "ClinicDo" },
  { src: "/partners/doctoorum.png", en: "Doctoorum", ar: "Doctoorum" },
  { src: "/partners/amis.jpg", en: "Commerce Syndicate (AMIS)", ar: "نقابة التجاريين AMIS" },
  { src: "/partners/engineers-syndicate.jpg", en: "Engineers Syndicate", ar: "نقابة المهندسين" },
  { src: "/partners/journalists-syndicate.jpg", en: "Journalists Syndicate", ar: "نقابة الصحفيين" },
  { src: "/partners/pms.jpg", en: "Petroleum Marine Services (PMS)", ar: "خدمات البترول البحرية" },
  { src: "/partners/suco.jpg", en: "Suez Oil Company (SUCO)", ar: "السويس للزيت" },
  { src: "/partners/petrosannan.jpg", en: "PetroSannan", ar: "بتروسنان" },
  { src: "/partners/egas.jpg", en: "EGAS", ar: "EGAS" },
];
