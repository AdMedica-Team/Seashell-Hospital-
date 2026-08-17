"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Wraps the hero text block and reveals its direct children with a staggered
 * GSAP intro on mount (rise + fade). Structure-agnostic — it animates whatever
 * children the server renders inside it.
 */
export function HeroText({
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
        y: 28,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.15,
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
