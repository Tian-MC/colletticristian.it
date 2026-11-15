"use client";

import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

export const themeInitScript = `(function(){try{var r=document.documentElement;var s=localStorage.getItem('${STORAGE_KEY}');var d=s?s==='dark':matchMedia('(prefers-color-scheme: dark)').matches;r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light';var n=navigator,c=n.connection;if((n.hardwareConcurrency&&n.hardwareConcurrency<=4)||(n.deviceMemory&&n.deviceMemory<=4)||(c&&c.saveData)){r.classList.add('low-power')}}catch(e){}})();`;

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): Theme | null {
  return null;
}

export function useTheme() {
  return useSyncExternalStore<Theme | null>(subscribe, getSnapshot, getServerSnapshot);
}

export function getStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "dark" || value === "light" ? value : null;
  } catch {
    return null;
  }
}

export function applyTheme(theme: Theme, persist = true) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* storage non disponibile: pazienza */
    }
  }
}

export function switchTheme(next: Theme, origin?: { x: number; y: number }) {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  root.classList.add("theme-switching");
  const release = () => requestAnimationFrame(() => root.classList.remove("theme-switching"));

  if (!document.startViewTransition || reduce || !origin) {
    applyTheme(next);
    release();
    return;
  }

  const { x, y } = origin;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  const transition = document.startViewTransition(() => {
    flushSync(() => applyTheme(next));
  });

  transition.ready
    .then(() => {
      root.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`],
        },
        {
          duration: 750,
          easing: "cubic-bezier(0.7, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {});

  transition.finished.finally(release);
}
