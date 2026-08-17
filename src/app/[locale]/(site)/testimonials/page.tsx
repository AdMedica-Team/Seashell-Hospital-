import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { pick } from "@/lib/i18n-content";
import type { Testimonial } from "@/generated/prisma/client";

function toEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      return `https://www.youtube.com/embed${parsed.pathname}`;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "vimeo.com") {
      return `https://player.vimeo.com/video${parsed.pathname}`;
    }
    return null;
  } catch {
    return null;
  }
}

export default async function TestimonialsPage({
  params,
}: PageProps<"/[locale]/testimonials">) {
  const { locale } = await params;
  const items = await prisma.testimonial.findMany({
    where: { isPublished: true, consentObtained: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return <TestimonialsContent items={items} locale={locale} />;
}

function TestimonialsContent({
  items,
  locale,
}: {
  items: Testimonial[];
  locale: string;
}) {
  const t = useTranslations("pages.testimonials");
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="font-display text-xs font-bold uppercase tracking-wide text-teal">
        {t("eyebrow")}
      </p>
      <h1 className="mt-2 font-display text-4xl text-ink">{t("heading")}</h1>
      <p className="mt-3 max-w-2xl text-ink/70">{t("intro")}</p>

      {items.length === 0 && <p className="mt-10 text-muted">{t("empty")}</p>}

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {items.map((item) => {
          const embed = item.videoUrl ? toEmbedUrl(item.videoUrl) : null;
          return (
            <figure
              key={item.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white"
            >
              {embed && (
                <div className="aspect-video w-full bg-black">
                  <iframe
                    src={embed}
                    title={pick(item.displayNameEn, item.displayNameAr, locale)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                {typeof item.rating === "number" && (
                  <p className="text-sm text-amber-500" aria-label={`${item.rating} / 5`}>
                    {"★".repeat(item.rating)}
                    <span className="text-line">{"★".repeat(5 - item.rating)}</span>
                  </p>
                )}
                {(item.quoteEn || item.quoteAr) && (
                  <blockquote className="mt-2 flex-1 text-ink/80">
                    “{pick(item.quoteEn ?? "", item.quoteAr ?? "", locale)}”
                  </blockquote>
                )}
                <figcaption className="mt-4 flex items-center gap-3">
                  {item.photoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.photoUrl}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  )}
                  <span className="font-display text-sm text-ink">
                    {pick(item.displayNameEn, item.displayNameAr, locale)}
                  </span>
                </figcaption>
              </div>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
