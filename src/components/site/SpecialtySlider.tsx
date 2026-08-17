"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/i18n-content";

type Procedure = { nameEn: string; nameAr: string };
type SpecialtyDept = {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  heroImageUrl: string | null;
  procedures: Procedure[];
};

const AUTOPLAY_MS = 6000;

const pillClass =
  "shrink-0 whitespace-nowrap rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-wide transition";

function ArrowIcon({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`icon-flip h-5 w-5 ${dir === "prev" ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SpecialtySlider({
  departments,
  locale,
}: {
  departments: SpecialtyDept[];
  locale: string;
}) {
  const t = useTranslations("clinicalExcellence");
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const dept = departments[active];
  const n = departments.length;

  const cardRef = useRef<HTMLDivElement | null>(null);
  const dirRef = useRef(1);
  const isFirst = useRef(true);

  const go = (next: number, dir: 1 | -1) => {
    dirRef.current = dir;
    setActive((next + n) % n);
  };

  // Auto-advance to the next specialty; pauses while the card is hovered
  // and restarts from zero on every manual navigation (since `active` change
  // re-triggers this effect either way).
  useEffect(() => {
    if (paused || n <= 1) return;
    const id = window.setInterval(() => go(active + 1, 1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, paused, n]);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (!cardRef.current) return;
    const offset = window.innerWidth + 100;
    gsap.fromTo(
      cardRef.current,
      { x: dirRef.current * offset, opacity: 0, scale: 0.92, filter: "blur(6px)" },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.95,
        ease: "power2.out",
      },
    );
  }, [active]);

  return (
    <div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {departments.map((d, i) => (
          <button
            key={d.id}
            type="button"
            onClick={() => go(i, i > active ? 1 : -1)}
            className={`${pillClass} ${
              i === active ? "border-ink bg-ink text-white" : "border-teal text-teal hover:bg-mint"
            }`}
          >
            {pick(d.nameEn, d.nameAr, locale)}
          </button>
        ))}
      </div>

      {dept && (
        <div
          className="relative mt-6"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button
            type="button"
            onClick={() => go(active - 1, -1)}
            aria-label="Previous"
            className="absolute start-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-teal text-white shadow-md rtl:translate-x-1/2"
          >
            <ArrowIcon dir="prev" />
          </button>

          <div className="overflow-hidden rounded-3xl shadow-[0_25px_60px_-15px_rgba(31,57,107,0.35)]">
            <div
              ref={cardRef}
              className="grid gap-6 bg-[linear-gradient(135deg,#ffffff_0%,#f5f9ff_55%,#eaf3ff_100%)] p-6 sm:grid-cols-2 sm:p-8"
            >
              <div>
                <h3 className="font-display text-2xl text-ink">{pick(dept.nameEn, dept.nameAr, locale)}</h3>
                <p className="mt-3 text-ink/80">{pick(dept.descriptionEn, dept.descriptionAr, locale)}</p>

                {dept.procedures.length > 0 && (
                  <div className="mt-5">
                    <p className="text-sm font-semibold text-ink">{t("topProcedures")}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {dept.procedures.map((proc) => (
                        <span
                          key={proc.nameEn}
                          className="rounded-full border border-line px-3 py-1 text-xs font-medium text-ink/70"
                        >
                          {pick(proc.nameEn, proc.nameAr, locale)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={{ pathname: "/doctors/find", query: { mode: "specialty", id: dept.id } }}
                    className="flex items-center gap-2 rounded-full border border-ink px-5 py-2.5 text-sm font-semibold text-ink"
                  >
                    {t("findDoctor")}
                    <ArrowIcon dir="next" />
                  </Link>
                  <Link
                    href={`/departments/${dept.slug}`}
                    className="flex items-center gap-2 rounded-full border border-ink px-5 py-2.5 text-sm font-semibold text-ink"
                  >
                    {t("exploreMore")}
                    <ArrowIcon dir="next" />
                  </Link>
                </div>
              </div>

              <div className="h-64 overflow-hidden rounded-2xl bg-mint sm:h-80">
                {dept.heroImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={dept.heroImageUrl} alt="" className="h-full w-full object-cover" />
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => go(active + 1, 1)}
            aria-label="Next"
            className="absolute end-0 top-1/2 z-10 translate-x-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-teal text-white shadow-md rtl:-translate-x-1/2"
          >
            <ArrowIcon dir="next" />
          </button>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/departments"
          className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#0090d7_0%,#1f396b_100%)] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[0_10px_25px_rgba(31,57,107,0.35)] transition hover:brightness-110"
        >
          {t("viewAllSpecialties")}
          <ArrowIcon dir="next" />
        </Link>
      </div>
    </div>
  );
}
