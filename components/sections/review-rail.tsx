"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ButtonArrow } from "@/components/brand";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";

export function ReviewRail({
  intro,
  label,
  prev,
  next,
  children,
}: {
  intro: ReactNode;
  label: string;
  prev: string;
  next: string;
  children: ReactNode;
}) {
  const rail = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const [edges, setEdges] = useState({ start: true, end: false });

  const { scrollXProgress } = useScroll({ container: rail });
  const visible = useMotionValue(1);
  const thumbWidth = useTransform(() => `${visible.get() * 100}%`);
  const thumbLeft = useTransform(() => `${scrollXProgress.get() * (1 - visible.get()) * 100}%`);

  const measure = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    visible.set(el.scrollWidth > 0 ? Math.min(1, el.clientWidth / el.scrollWidth) : 1);
    setEdges({
      start: el.scrollLeft <= 2,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
    });
  }, [visible]);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, [measure]);

  function go(direction: 1 | -1) {
    const el = rail.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <div>
      <div className="container-site flex items-end justify-between gap-8">
        {intro}
        <div className="hidden shrink-0 gap-2 pb-1 md:flex">
          <Button variant="outline" size="icon" aria-label={prev} disabled={edges.start} onClick={() => go(-1)}>
            <ButtonArrow className="rotate-180" />
          </Button>
          <Button variant="outline" size="icon" aria-label={next} disabled={edges.end} onClick={() => go(1)}>
            <ButtonArrow />
          </Button>
        </div>
      </div>

      <Reveal>
        <ul
          ref={rail}
          tabIndex={0}
          aria-label={label}
          className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain py-2 [scrollbar-width:none] md:mt-14 md:gap-5 [&::-webkit-scrollbar]:hidden px-[max(1.25rem,calc((100%_-_82rem)/2_+_1.25rem))] scroll-px-[max(1.25rem,calc((100%_-_82rem)/2_+_1.25rem))] md:px-[max(2.5rem,calc((100%_-_82rem)/2_+_2.5rem))] md:scroll-px-[max(2.5rem,calc((100%_-_82rem)/2_+_2.5rem))]"
        >
          {children}
        </ul>
      </Reveal>

      <div className="container-site mt-6">
        <div aria-hidden className="relative h-1 overflow-hidden rounded-full bg-line/70">
          <motion.span style={{ width: thumbWidth, left: thumbLeft }} className="absolute inset-y-0 rounded-full bg-linear-to-r from-cta to-orchid" />
        </div>
      </div>
    </div>
  );
}
