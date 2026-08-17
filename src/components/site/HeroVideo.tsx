"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// Cover clips cycled as the hero background, in order. All are muted, 1080p, web-optimized.
const CLIPS = ["/hero_cover.mp4", "/hero_1.mp4", "/hero_2.mp4"];
// Advance after a clip ends OR after this long — whichever comes first — so the
// wave transition is seen regularly even though the first clip is ~45s long.
const MAX_MS = 10000;

// Wave-front clip-path: a rippling sine edge that sweeps in from the side to
// fill the frame as `p` goes 0 → 1, like a wave rolling toward the shore.
function wavePolygon(p: number): string {
  const N = 40;
  const amp = 5; // wave depth, %
  const waves = 5; // number of ripples along the edge — higher = tighter waves
  const baseX = 110 - p * 130; // wave front sweeps in from the right edge
  const phase = p * Math.PI * 3; // ripple travels along the edge as it advances
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const y = (i / N) * 100;
    const x = baseX + Math.sin((i / N) * Math.PI * waves + phase) * amp;
    pts.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
  }
  pts.push("100% 100%", "100% 0%");
  return `polygon(${pts.join(", ")})`;
}

/**
 * Rotating hero background. Each clip plays fully; when it ends the next one
 * washes in with an ocean-wave reveal (rippling clip-path rising to fill the
 * frame). Loops back to the first. Muted + playsInline so autoplay is allowed.
 */
export function HeroVideo({
  poster,
  fit = "contain",
}: {
  poster?: string;
  fit?: "cover" | "contain";
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const prevRef = useRef(0);

  // Guarded advance: only moves on if `from` is still the active clip, so the
  // `ended` event can't double-advance the same clip.
  const advance = (from: number) =>
    setActive((prev) => (prev === from ? (prev + 1) % CLIPS.length : prev));

  useEffect(() => {
    refs.current.forEach((video, index) => {
      if (!video) return;
      if (index === active) {
        video.currentTime = 0;
        video.play().catch(() => {
          /* autoplay may be blocked; poster/first frame still shows */
        });
        gsap.set(video, { zIndex: 2, autoAlpha: 1 });
        // Wave-front reveal.
        const wave = { p: 0 };
        video.style.clipPath = wavePolygon(0);
        gsap.to(wave, {
          p: 1,
          duration: 1.9,
          ease: "power2.inOut",
          overwrite: true,
          onUpdate: () => {
            video.style.clipPath = wavePolygon(wave.p);
          },
          onComplete: () => {
            video.style.clipPath = "none";
            // Once fully covered, drop the clips underneath.
            refs.current.forEach((other, oi) => {
              if (other && oi !== index) {
                other.pause();
                gsap.set(other, { autoAlpha: 0 });
              }
            });
          },
        });
      } else if (index === prevRef.current) {
        // Stay visible beneath the wave until it finishes covering.
        gsap.set(video, { zIndex: 1, autoAlpha: 1 });
      } else {
        gsap.set(video, { autoAlpha: 0, zIndex: 0 });
        video.pause();
      }
    });
    prevRef.current = active;

    const timer = setTimeout(() => advance(active), MAX_MS);
    return () => clearTimeout(timer);
  }, [active]);

  return (
    <div className="absolute inset-0 isolate">
      {CLIPS.map((src, index) => (
        <video
          key={src}
          ref={(el) => {
            refs.current[index] = el;
          }}
          className={`absolute inset-0 h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
          style={{ opacity: index === 0 ? 1 : 0 }}
          muted
          playsInline
          preload="auto"
          autoPlay={index === 0}
          poster={index === 0 ? poster : undefined}
          aria-hidden="true"
          onEnded={() => advance(index)}
        >
          <source src={src} type="video/mp4" />
        </video>
      ))}
    </div>
  );
}
