"use client";

import { MotionConfig, useReducedMotion } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { SmoothScroll } from "@/components/smooth-scroll";
import { applyTheme, getStoredTheme } from "@/lib/theme";

function FollowSystemTheme() {
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!getStoredTheme()) applyTheme(mql.matches ? "dark" : "light", false);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <MotionConfig reducedMotion="user" skipAnimations={reduce === true}>
      <SmoothScroll>
        <FollowSystemTheme />
        {children}
      </SmoothScroll>
    </MotionConfig>
  );
}
