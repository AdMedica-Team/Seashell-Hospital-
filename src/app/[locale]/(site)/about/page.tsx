import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { pick } from "@/lib/i18n-content";
import type { Award, LeadershipMember } from "@/generated/prisma/client";

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  const [leadership, awards] = await Promise.all([
    prisma.leadershipMember.findMany({ orderBy: { order: "asc" } }),
    prisma.award.findMany({
      where: { isPublished: true },
      orderBy: [{ order: "asc" }, { year: "desc" }],
    }),
  ]);
  return <AboutContent leadership={leadership} awards={awards} locale={locale} />;
}

function AboutContent({
  leadership,
  awards,
  locale,
}: {
  leadership: LeadershipMember[];
  awards: Award[];
  locale: string;
}) {
  const t = useTranslations("pages.about");

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      {/* Intro */}
      <p className="font-display text-xs font-bold uppercase tracking-wide text-teal">
        {t("eyebrow")}
      </p>
      <h1 className="mt-2 font-display text-4xl text-ink">{t("heading")}</h1>
      <p className="mt-6 max-w-3xl whitespace-pre-line text-lg text-ink/80">{t("intro")}</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <div id="mission" className="scroll-mt-24 rounded-2xl border border-line bg-white p-6">
          <h3 className="font-display text-lg text-ink">{t("missionTitle")}</h3>
          <p className="mt-2 text-sm text-ink/70">{t("missionBody")}</p>
        </div>
        <div id="vision" className="scroll-mt-24 rounded-2xl border border-line bg-white p-6">
          <h3 className="font-display text-lg text-ink">{t("visionTitle")}</h3>
          <p className="mt-2 text-sm text-ink/70">{t("visionBody")}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6">
          <h3 className="font-display text-lg text-ink">{t("valuesTitle")}</h3>
          <p className="mt-2 text-sm text-ink/70">{t("valuesBody")}</p>
        </div>
      </div>

      {/* Leadership */}
      {leadership.length > 0 && (
        <section id="leadership" className="mt-16 scroll-mt-24">
          <h2 className="font-display text-2xl text-ink">{t("leadershipHeading")}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {leadership.map((member) => (
              <article
                key={member.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white"
              >
                {member.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.photoUrl}
                    alt=""
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <div className="h-56 w-full bg-mint" />
                )}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg text-ink">
                    {pick(member.nameEn, member.nameAr, locale)}
                  </h3>
                  <p className="text-sm font-medium text-teal">
                    {pick(member.titleEn, member.titleAr, locale)}
                  </p>
                  <p className="mt-3 text-sm text-ink/70">
                    {pick(member.bioEn, member.bioAr, locale)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Awards & Accreditations */}
      {awards.length > 0 && (
        <section id="awards" className="mt-16 scroll-mt-24">
          <h2 className="font-display text-2xl text-ink">{t("awardsHeading")}</h2>
          <p className="mt-2 max-w-2xl text-ink/70">{t("awardsIntro")}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {awards.map((award) => (
              <div
                key={award.id}
                className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5"
              >
                {award.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={award.logoUrl}
                    alt=""
                    className="h-14 w-14 shrink-0 object-contain"
                  />
                ) : (
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-mint font-display text-teal">
                    {award.year}
                  </div>
                )}
                <div>
                  <h3 className="font-display text-sm text-ink">
                    {pick(award.titleEn, award.titleAr, locale)}
                  </h3>
                  {(award.issuerEn || award.issuerAr) && (
                    <p className="text-xs text-muted">
                      {pick(award.issuerEn ?? "", award.issuerAr ?? "", locale)} · {award.year}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
