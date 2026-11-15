"use client";

import Lenis from "lenis";
import { useCallback, useEffect, type ReactNode } from "react";

let active: Lenis | null = null;

export function getLenis() {
  return active;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: true,
      allowNestedScroll: true,
    });
    active = instance;

    return () => {
      instance.destroy();
      if (active === instance) active = null;
    };
  }, []);

  return children;
}

export function useScrollTo() {
  return useCallback(
    (hash: string) => {
      const target = hash === "#" || hash === "#inizio" ? null : document.querySelector<HTMLElement>(hash);
      if (hash !== "#" && hash !== "#inizio" && !target) return;

      const lenis = active;
      if (lenis) {
        lenis.scrollTo(target ?? 0, { duration: 1.5, force: true });
      } else {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (target) target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
        else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }

      target?.focus({ preventScroll: true });
      history.replaceState(null, "", hash === "#" ? location.pathname : hash);
    },
    [],
  );
}
