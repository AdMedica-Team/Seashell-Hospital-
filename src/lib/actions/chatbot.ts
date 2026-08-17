"use server";

import { prisma } from "@/lib/db";

export type ChatbotSearchResult = {
  doctors: {
    slug: string;
    nameEn: string;
    nameAr: string;
    titleEn: string;
    titleAr: string;
  }[];
  departments: { slug: string; nameEn: string; nameAr: string }[];
  faqs: {
    id: string;
    questionEn: string;
    questionAr: string;
    answerEn: string;
    answerAr: string;
  }[];
};

const EMPTY: ChatbotSearchResult = { doctors: [], departments: [], faqs: [] };

/**
 * Public, unauthenticated search over PUBLISHED content only. Powers the guided
 * chatbot's free-text queries — no AI, just a case-insensitive lookup across
 * doctors, departments, and FAQ.
 */
export async function chatbotSearch(query: string): Promise<ChatbotSearchResult> {
  const q = query.trim();
  if (q.length < 2) return EMPTY;

  const contains = { contains: q, mode: "insensitive" as const };

  const [doctors, departments, faqs] = await Promise.all([
    prisma.doctor.findMany({
      where: {
        isPublished: true,
        OR: [
          { nameEn: contains },
          { nameAr: contains },
          { titleEn: contains },
          { titleAr: contains },
        ],
      },
      select: { slug: true, nameEn: true, nameAr: true, titleEn: true, titleAr: true },
      take: 5,
    }),
    prisma.department.findMany({
      where: {
        isPublished: true,
        OR: [
          { nameEn: contains },
          { nameAr: contains },
          { summaryEn: contains },
          { summaryAr: contains },
        ],
      },
      select: { slug: true, nameEn: true, nameAr: true },
      take: 5,
    }),
    prisma.fAQItem.findMany({
      where: {
        isPublished: true,
        OR: [
          { questionEn: contains },
          { questionAr: contains },
          { answerEn: contains },
          { answerAr: contains },
        ],
      },
      select: { id: true, questionEn: true, questionAr: true, answerEn: true, answerAr: true },
      take: 4,
    }),
  ]);

  return { doctors, departments, faqs };
}
