import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/i18n-content";
import type { NewsPost } from "@/generated/prisma/client";

export default async function NewsIndexPage({ params }: PageProps<"/[locale]/news">) {
  const { locale } = await params;
  const posts = await prisma.newsPost.findMany({
    where: { isPublished: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  return <NewsIndexContent posts={posts} locale={locale} />;
}

function NewsIndexContent({ posts, locale }: { posts: NewsPost[]; locale: string }) {
  const t = useTranslations("pages.news");
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="font-display text-xs font-bold uppercase tracking-wide text-teal">
        {t("eyebrow")}
      </p>
      <h1 className="mt-2 font-display text-4xl text-ink">{t("heading")}</h1>

      {posts.length === 0 && <p className="mt-10 text-muted">{t("empty")}</p>}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/news/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:border-teal"
          >
            {post.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.coverImageUrl}
                alt=""
                className="h-44 w-full object-cover"
              />
            ) : (
              <div className="h-44 w-full bg-mint" />
            )}
            <div className="flex flex-1 flex-col p-5">
              {post.publishedAt && (
                <p className="text-xs text-muted">
                  {new Date(post.publishedAt).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
              <h3 className="mt-1 font-display text-lg text-ink group-hover:text-teal">
                {pick(post.titleEn, post.titleAr, locale)}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-ink/70">
                {pick(post.excerptEn, post.excerptAr, locale)}
              </p>
              <span className="mt-4 text-sm font-medium text-teal">{t("readMore")}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
