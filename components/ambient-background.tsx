"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

export function AmbientBackground() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const drift = useTransform(scrollYProgress, [0, 1], ["0vh", "-18vh"]);

  const pointerX = useSpring(-1000, { stiffness: 60, damping: 20, mass: 0.6 });
  const pointerY = useSpring(-1000, { stiffness: 60, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (reduce || document.documentElement.classList.contains("low-power")) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (event: PointerEvent) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, pointerX, pointerY]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div style={{ y: reduce ? 0 : drift }} className="absolute inset-0 h-[120vh]">
        <div className="ambient-blob ambient-blob--1" />
        <div className="ambient-blob ambient-blob--2" />
        <div className="ambient-blob ambient-blob--3" />
      </motion.div>
      <motion.div
        style={{ x: pointerX, y: pointerY }}
        className="absolute top-0 left-0 -mt-[32rem] -ml-[32rem] size-[64rem] rounded-full bg-[radial-gradient(closest-side,var(--glow-1),transparent)] opacity-35 will-change-transform dark:opacity-55"
      />
      <div className="grain absolute inset-0" />
    </div>
  );
}
