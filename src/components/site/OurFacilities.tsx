"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/site/Reveal";

function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 3H3v6M15 3h6v6M21 15v6h-6M3 15v6h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function FacilityCell({
  src,
  label,
  wide,
  hovered,
  dimmed,
  onHover,
  onLeave,
  onOpen,
}: {
  src: string;
  label: string;
  wide?: boolean;
  hovered: boolean;
  dimmed: boolean;
  onHover: () => void;
  onLeave: () => void;
  onOpen: () => void;
}) {
  // The outer button is a direct child of the GSAP-driven `Reveal` wrapper,
  // which tweens its opacity/transform on scroll-in — so it must stay free
  // of any CSS `transition`/`animation` on those same properties (see
  // Reveal's docblock). All hover-driven motion lives on nested elements.
  //
  // The zoomed image itself uses a CSS *animation* (not a transition) so it
  // can keep breathing continuously while hovered — mixing a transition and
  // an animation on the same transform would make them fight, so the base
  // "click to open" affordance and the breakout zoom are kept on separate
  // elements (outer button vs. the <Image>).
  return (
    <button
      type="button"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onOpen}
      aria-label={label}
      className={`group relative block w-full rounded-2xl text-start transition-shadow duration-500 sm:h-full ${
        wide ? "col-span-2 h-48 sm:col-span-1 sm:row-span-2" : "h-40"
      } ${
        hovered
          ? "z-20 shadow-[0_25px_50px_rgba(24,48,92,0.5),inset_0_1px_0_rgba(255,255,255,0.6)]"
          : "z-0 shadow-[0_10px_22px_rgba(24,48,92,0.28),inset_0_1px_0_rgba(255,255,255,0.5)]"
      }`}
    >
      <div
        className={`relative h-full rounded-2xl transition-opacity duration-500 ${dimmed ? "opacity-60" : ""} ${
          hovered ? "overflow-visible" : "overflow-hidden"
        }`}
      >
        {/* Image + overlay + caption scale together as one unit so the
            dark gradient and label always fully cover the image, even
            while it's breathing/zoomed past the card's own frame. */}
        <div
          className={`relative h-full w-full ${hovered ? "animate-[breathing-zoom_2.5s_ease-in-out_infinite]" : ""}`}
        >
          <Image
            src={src}
            alt={label}
            width={536}
            height={326}
            className={`h-full w-full object-cover transition-[filter] duration-500 ease-out ${
              hovered ? "saturate-150 contrast-110" : ""
            } ${dimmed ? "grayscale-[0.35] brightness-90" : ""}`}
          />
          <div
            className={`absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(15,25,50,0.8)_100%)] transition-opacity duration-500 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />
          <span
            className={`absolute end-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-[linear-gradient(180deg,#ffffff_0%,#eaf3ff_100%)] text-ink shadow-[0_4px_10px_rgba(15,25,50,0.35),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-300 ${
              hovered ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
            }`}
          >
            <ExpandIcon />
          </span>
          <p
            className={`absolute inset-x-4 bottom-3 font-display text-sm font-bold text-white transition-all duration-500 ${
              hovered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            {label}
          </p>
        </div>
      </div>
    </button>
  );
}

function Lightbox({ src, label, onClose }: { src: string; label: string; onClose: () => void }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal
      aria-label={label}
      onClick={onClose}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0f1a]/90 p-4 backdrop-blur-sm transition-opacity duration-300 sm:p-10 ${
        shown ? "opacity-100" : "opacity-0"
      }`}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute end-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
      >
        <CloseIcon />
      </button>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative max-h-[85vh] max-w-4xl overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 ${
          shown ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <Image
          src={src}
          alt={label}
          width={1200}
          height={800}
          className="max-h-[85vh] w-full object-contain saturate-125 contrast-105"
        />
        <p className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent_0%,rgba(15,25,50,0.85)_100%)] px-5 py-4 font-display text-base font-bold text-white">
          {label}
        </p>
      </div>
    </div>
  );
}

/**
 * Bento-style photo grid of the hospital's real facilities/care spaces —
 * four small cells on the left, one tall cell spanning both rows on the
 * right (mirrors to the correct side automatically in RTL via grid-flow).
 * Hovering a cell "spotlights" it — it zooms and pops forward at full
 * color/z-index while the rest of the grid dims and settles back. Clicking
 * a cell opens it full-size in a popup lightbox. The whole grid also fades
 * up into view via the shared GSAP ScrollTrigger `Reveal` wrapper.
 */
export function OurFacilities() {
  const t = useTranslations("ourFacilities");
  const [hovered, setHovered] = useState<number | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const cells = [
    { src: "/facilities/surgery.jpg", label: t("surgery") },
    { src: "/facilities/cssd.jpg", label: t("cssd") },
    { src: "/facilities/operation-room-1.jpg", label: t("surgery"), wide: true },
    { src: "/facilities/icu-1.jpg", label: t("icu") },
    { src: "/facilities/inpatient-room.jpg", label: t("inpatientRoom") },
  ];

  return (
    <section className="bg-[linear-gradient(160deg,#18305c_0%,#18305c_30%,#0090d7_65%,#9fd7f0_100%)] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <p className="font-display text-xs font-bold uppercase tracking-wide text-white">{t("eyebrow")}</p>
        <h2 className="mt-2 font-display text-3xl text-white sm:text-4xl">{t("heading")}</h2>
        <p className="mt-4 max-w-2xl text-white/80">{t("body")}</p>

        <Reveal className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:grid-rows-[220px_220px]">
          {cells.map((cell, i) => (
            <FacilityCell
              key={cell.src}
              src={cell.src}
              label={cell.label}
              wide={cell.wide}
              hovered={hovered === i}
              dimmed={hovered !== null && hovered !== i}
              onHover={() => setHovered(i)}
              onLeave={() => setHovered(null)}
              onOpen={() => setOpenIndex(i)}
            />
          ))}
        </Reveal>
      </div>

      {openIndex !== null && (
        <Lightbox src={cells[openIndex].src} label={cells[openIndex].label} onClose={() => setOpenIndex(null)} />
      )}
    </section>
  );
}
