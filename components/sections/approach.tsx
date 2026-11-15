"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef } from "react";
import { Reveal } from "@/components/motion";
import type { Dictionary } from "@/content/types";
import { cn } from "@/lib/utils";
import { SectionIntro } from "./section-intro";

export function Approach({ t, id }: { t: Dictionary["approach"]; id: string }) {
  return (
    <section id={id} tabIndex={-1} className="tone-sky relative py-20 md:py-24">
      <div className="container-site">
        <Steps t={t} />
      </div>
    </section>
  );
}

const stepTones = ["tone-violet", "tone-rose", "tone-coral", "tone-teal"];

function wave() {
  let d = "M0 40";
  for (let x = 10; x <= 1200; x += 10) {
    const y = 40 + Math.sin(((x - 150) / 300) * Math.PI * 2) * 22;
    d += ` L${x} ${y.toFixed(2)}`;
  }
  return d;
}

const WAVE = wave();

function Steps({ t }: { t: Dictionary["approach"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });
  const spring = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });
  const reduce = useReducedMotion();
  const progress = useMotionValue(0);
  useMotionValueEvent(spring, "change", (value) => {
    if (!reduce) progress.set(value);
  });
  useEffect(() => {
    progress.set(reduce ? 1 : spring.get());
  }, [reduce, progress, spring]);

  return (
    <div>
      <SectionIntro
        eyebrow={t.processEyebrow}
        title={t.processTitle}
      />

      <div ref={ref} className="relative mt-16 pl-12 md:mt-24 lg:pt-28 lg:pl-0">
        <svg
          aria-hidden
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          className="absolute top-0 left-0 hidden h-20 w-full overflow-visible lg:block"
          fill="none"
        >
          <path d={WAVE} className="stroke-line" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <motion.path
            d={WAVE}
            stroke="url(#steps-gradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: progress }}
          />
          <defs>
            <linearGradient id="steps-gradient" x1="0" x2="1200" y1="0" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0.125" style={{ stopColor: "var(--grape)" }} />
              <stop offset="0.375" style={{ stopColor: "var(--rose)" }} />
              <stop offset="0.625" style={{ stopColor: "var(--coral)" }} />
              <stop offset="0.875" style={{ stopColor: "var(--teal)" }} />
            </linearGradient>
          </defs>
        </svg>

        <span aria-hidden className="absolute top-2 bottom-2 left-[15px] w-px bg-line lg:hidden" />
        <motion.span
          aria-hidden
          style={{ scaleY: progress }}
          className="absolute top-2 bottom-2 left-[15px] w-px origin-top bg-[linear-gradient(to_bottom,var(--grape),var(--rose),var(--coral),var(--teal))] lg:hidden"
        />

        <ol className="grid gap-12 lg:grid-cols-4 lg:gap-0">
          {t.steps.map((step, i) => (
            <Step key={step.title} step={step} index={i} progress={progress} />
          ))}
        </ol>
      </div>
    </div>
  );
}

function Step({
  step,
  index,
  progress,
}: {
  step: Dictionary["approach"]["steps"][number];
  index: number;
  progress: MotionValue<number>;
}) {
  const threshold = (150 + index * 300) / 1200;
  const lit = useTransform(progress, [threshold - 0.06, threshold], [0, 1]);
  const scale = useTransform(lit, [0, 1], [0.6, 1]);

  return (
    <li className={cn("relative lg:px-5", stepTones[index % stepTones.length])}>
      <span
        aria-hidden
        className="absolute top-1 -left-12 grid size-8 place-items-center lg:-top-28 lg:left-1/2 lg:mt-6 lg:-translate-x-1/2"
      >
        <span className="absolute inset-0 rounded-full border border-line bg-paper" />
        <motion.span style={{ opacity: lit, scale }} className="absolute inset-0 rounded-full bg-cta shadow-[0_0_0_6px_var(--violet-soft)]" />
        <span
          data-n={index + 1}
          className="relative text-xs font-medium text-ink tabular-nums before:content-[attr(data-n)]"
        >
          <motion.span
            data-n={index + 1}
            style={{ opacity: lit }}
            className="absolute inset-0 grid place-items-center text-on-cta before:content-[attr(data-n)]"
          />
        </span>
      </span>

      <Reveal delay={index * 0.08} className="lg:text-center">
        <h3 className="font-display text-[1.75rem] leading-tight tracking-[-0.02em]">{step.title}</h3>
        <p className="mt-3 leading-relaxed text-pretty text-ink-soft lg:mx-auto lg:max-w-[17rem]">{step.text}</p>
        <p className="mt-5 inline-flex rounded-full bg-violet-soft px-3 py-1 text-sm font-medium text-violet">{step.detail}</p>
      </Reveal>
    </li>
  );
}
