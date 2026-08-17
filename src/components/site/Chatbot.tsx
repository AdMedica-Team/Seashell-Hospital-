import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/settings";
import { CAREERS_EMAIL, LOCATION_LINK, INSURANCE_PARTNERS } from "@/lib/hospital-info";
import { ChatbotClient } from "./ChatbotClient";

/**
 * Server wrapper: preloads the small "browse" datasets (departments + top FAQ)
 * and contact details so the guided menu answers instantly, then hands them to
 * the client widget. Free-text search is handled separately via a server action.
 */
export async function Chatbot() {
  const [departments, faqs, settings] = await Promise.all([
    prisma.department.findMany({
      where: { isPublished: true },
      select: { slug: true, nameEn: true, nameAr: true },
      orderBy: { order: "asc" },
      take: 12,
    }),
    prisma.fAQItem.findMany({
      where: { isPublished: true },
      select: { questionEn: true, questionAr: true, answerEn: true, answerAr: true },
      orderBy: [{ category: "asc" }, { order: "asc" }],
      take: 6,
    }),
    getSiteSettings(),
  ]);

  return (
    <ChatbotClient
      departments={departments}
      faqs={faqs}
      emergencyNumber={settings.emergencyNumber}
      hotlineNumber={settings.hotlineNumber}
      whatsappNumber={settings.whatsappNumber}
      addressEn={settings.addressEn}
      addressAr={settings.addressAr}
      locationLink={LOCATION_LINK}
      careersEmail={CAREERS_EMAIL}
      insurancePartners={INSURANCE_PARTNERS}
    />
  );
}
