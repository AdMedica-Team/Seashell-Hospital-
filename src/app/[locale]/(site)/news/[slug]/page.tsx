import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/i18n-content";
import type { NewsPost } from "@/generated/prisma/client";

export default async function NewsDetailPage({
  params,
}: PageProps<"/[locale]/news/[slug]">) {
  const { locale, slug } = await params;

  const post = await prisma.newsPost.findUnique({ where: { slug } });
  if (!post || !post.isPublished) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: pick(post.titleEn, post.titleAr, locale),
    description: pick(post.excerptEn, post.excerptAr, locale),
    ...(post.coverImageUrl && { image: post.coverImageUrl }),
    ...(post.publishedAt && { datePublished: new Date(post.publishedAt).toISOString() }),
    dateModified: new Date(post.updatedAt).toISOString(),
    publisher: { "@type": "Organization", name: "Seashell Hospital" },
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NewsDetailContent post={post} locale={locale} />
    </div>
  );
}

function NewsDetailContent({ post, locale }: { post: NewsPost; locale: string }) {
  const t = useTranslations("pages.news");

  return (
    <>
      <Link href="/news" className="text-sm font-medium text-teal">
        {t("backToNews")}
      </Link>
      <p className="mt-6 font-display text-xs font-bold uppercase tracking-wide text-teal">
        {t("eyebrow")}
      </p>
      <h1 className="mt-2 font-display text-3xl text-ink">
        {pick(post.titleEn, post.titleAr, locale)}
      </h1>
      {post.publishedAt && (
        <p className="mt-2 text-sm text-muted">
          {new Date(post.publishedAt).toLocaleDateString(locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}
      {post.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImageUrl}
          alt=""
          className="mt-6 w-full rounded-2xl object-cover"
        />
      )}
      <p className="mt-6 whitespace-pre-line text-ink/80">
        {pick(post.bodyEn, post.bodyAr, locale)}
      </p>
    </>
  );
}
