import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://seashellhospital.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The CMS and auth endpoints must never be indexed.
      disallow: ["/en/admin", "/ar/admin", "/api"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
