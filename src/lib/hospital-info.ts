/**
 * Static hospital contact/business info surfaced by the chatbot (and reusable
 * elsewhere). Kept here — not in the DB — because it changes rarely and has no
 * admin screen yet. Address and the call-center number live in SiteSettings
 * (admin-editable); these are the extras the client provided for the chatbot.
 */

/** Careers inbox — CVs are sent here. */
export const CAREERS_EMAIL = "hr.info@seashellhospital.com";

/** Short link to the hospital's location on the map. */
export const LOCATION_LINK = "https://rb.gy/403pz5";

/**
 * Social-media profiles shown in the footer. Replace the "#" placeholders with
 * the real profile URLs when available; a "#" entry is treated as "not set".
 */
export const SOCIAL_LINKS = {
  linkedin: "#",
  x: "#",
  youtube: "#",
  facebook: "#",
  instagram: "#",
} as const;

/**
 * Medical-insurance / corporate partners the hospital is contracted with.
 * The list keeps growing ("جاري التعاقد مع المزيد"), so update this array as
 * new agreements are signed. Brand names that are the same in both languages
 * repeat intentionally.
 */
export const INSURANCE_PARTNERS: { en: string; ar: string }[] = [
  { en: "AXA", ar: "AXA" },
  { en: "Nextcare", ar: "Nextcare" },
  { en: "Med Right", ar: "Med Right" },
  { en: "GlobeMed", ar: "GlobeMed" },
  { en: "AMC – Al Ahly Medical Services", ar: "الأهلي للخدمات الطبية AMC" },
  { en: "Engineers Syndicate", ar: "نقابة المهندسين" },
  { en: "Medical Professions Syndicate", ar: "نقابة المهن الطبية" },
  { en: "Mednet", ar: "Mednet" },
  { en: "Medexa", ar: "Medexa" },
  { en: "Egyptian Ministry of Justice", ar: "وزارة العدل المصرية" },
  { en: "Vezeeta", ar: "Vezeeta" },
  { en: "Mersal", ar: "Mersal" },
  { en: "Wadi El Nil Medical Care", ar: "وادي النيل للرعاية الطبية" },
  { en: "SehaTech (Seha One)", ar: "صحة وان SehaTech" },
  { en: "Commerce Syndicate (AMIS)", ar: "نقابة التجاريين AMIS" },
  { en: "Journalists Syndicate", ar: "نقابة الصحفيين" },
  { en: "Doctoorum", ar: "Doctoorum" },
  { en: "Smart Medical Services", ar: "سمارت للخدمات الطبية" },
  { en: "Misr Healthcare", ar: "Misr Healthcare" },
  { en: "EGYMED – Egyptian Medical Services", ar: "المصرية للخدمات الطبية EGYMED" },
  { en: "Care Plus", ar: "Care Plus" },
  { en: "Maak.Egypt", ar: "Maak.Egypt" },
  { en: "Egycare", ar: "Egycare" },
  { en: "PetroJet", ar: "PetroJet" },
  { en: "Reliance Health", ar: "Reliance Health" },
  { en: "Axon", ar: "axon" },
  { en: "Medmark", ar: "Medmark" },
  { en: "Swagrass", ar: "Swagrass" },
  { en: "Xclusives Card", ar: "Xclusives Card" },
  { en: "EGAS", ar: "EGAS" },
  { en: "ClinicDo", ar: "ClinicDo" },
  { en: "GIG", ar: "GIG" },
  { en: "Lebo Family", ar: "Lebo family" },
  { en: "Life HealthCare", ar: "Life HealthCare" },
  { en: "DMS – Diamond Medical Services", ar: "dms Diamond Medical Services" },
  { en: "Limitless Care", ar: "Limitless Care" },
  { en: "Medsure", ar: "Medsure" },
  { en: "PetroTrade", ar: "بتروتريد" },
  { en: "Enaya Misr", ar: "عناية مصر" },
  { en: "Al Riyadh Medical Services", ar: "الرياض للخدمات الطبية" },
  { en: "Future Healthcare", ar: "Future Healthcare" },
  { en: "Al Mashreq Insurance", ar: "المشرق للتأمين" },
  { en: "Agiba Petroleum", ar: "عجيبة للبترول" },
  { en: "San Misr", ar: "صان مصر" },
  { en: "WASCO – El Wastani Petroleum", ar: "واسكو الوسطاني للبترول" },
  { en: "Suez Oil Company (SUCO)", ar: "السويس للزيت" },
  { en: "Petroleum Marine Services (PMS)", ar: "خدمات البترول البحرية" },
  { en: "PetroSannan", ar: "بتروسنان" },
  { en: "Sianco", ar: "صيانكو" },
];
