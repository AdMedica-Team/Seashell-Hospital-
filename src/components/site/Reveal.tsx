"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Reveals its direct children with a staggered fade-up as the block scrolls
 * into view (GSAP ScrollTrigger). Renders a plain div, so layout/grid classes
 * can be passed straight through via `className`.
 *
 * Direct children of this wrapper must not carry their own CSS `transition`
 * on opacity/transform — a competing CSS transition on the same element GSAP
 * is tweening causes the browser to fight GSAP's per-frame style writes, so
 * the entrance animation can complete internally (per GSAP) while the
 * element visually stays stuck at its "from" state. Put any hover/interaction
 * transitions on an inner wrapper instead.
 */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el.children, {
        autoAlpha: 0,
        y: 40,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
