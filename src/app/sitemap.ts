import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { routing } from "@/i18n/routing";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://seashellhospital.com";

// Static public routes (locale-prefixed at build time for each locale).
const STATIC_PATHS = [
  "",
  "/about",
  "/departments",
  "/centers-of-excellence",
  "/doctors",
  "/doctors/find",
  "/news",
  "/testimonials",
  "/careers",
  "/calculators",
  "/calculators/bmi",
  "/calculators/bmr",
  "/calculators/body-fat",
  "/faq",
  "/contact",
  "/appointment",
  "/legal/privacy",
  "/legal/terms",
  "/anti-fraud-notice",
];

function localizedEntries(
  path: string,
  lastModified?: Date,
): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: `${BASE_URL}/${locale}${path}`,
    lastModified,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}${path}`]),
      ),
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [departments, doctors, news, jobs] = await Promise.all([
    prisma.department.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.doctor.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.newsPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.jobOpening.findMany({
      where: { isOpen: true },
      select: { slug: true, postedAt: true },
    }),
  ]);

  return [
    ...STATIC_PATHS.flatMap((path) => localizedEntries(path)),
    ...departments.flatMap((d) => localizedEntries(`/departments/${d.slug}`, d.updatedAt)),
    ...doctors.flatMap((d) => localizedEntries(`/doctors/${d.slug}`, d.updatedAt)),
    ...news.flatMap((n) => localizedEntries(`/news/${n.slug}`, n.updatedAt)),
    ...jobs.flatMap((j) => localizedEntries(`/careers/${j.slug}`, j.postedAt)),
  ];
}
