"use client";

import { useEffect, useState } from "react";

/**
 * True once the element with `heroId` has scrolled out of view (or if no
 * such element exists on the current page). Used to keep floating UI from
 * overlapping the homepage hero while still tracking scroll everywhere else.
 */
export function usePastHero(heroId = "site-hero") {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero) {
      setPastHero(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), {
      threshold: 0.1,
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [heroId]);

  return pastHero;
}
