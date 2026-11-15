"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Eyebrow } from "@/components/brand";
import { EASE, Reveal, WordsReveal } from "@/components/motion";
import { Rich } from "@/components/rich";
import type { Dictionary } from "@/content/types";
import { cn } from "@/lib/utils";

const commitmentTones = ["tone-violet", "tone-coral", "tone-teal"];

export function About({ t, id, name }: { t: Dictionary["about"]; id: string; name: string }) {
  return (
    <section id={id} tabIndex={-1} className="relative py-20 md:py-24">
      <div className="container-site grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Portrait name={name} role={t.portraitRole} />
        </div>

        <div className="lg:col-span-7 lg:pt-10 lg:pl-8">
          <Reveal y={12}>
            <Eyebrow>{t.eyebrow}</Eyebrow>
          </Reveal>
          <WordsReveal
            text={t.title}
            className="mt-6 font-display text-[clamp(2.2rem,4.4vw,3.9rem)] leading-[1.04] font-[380] tracking-[-0.028em] text-balance"
            stagger={0.04}
          />

          <div className="mt-10 grid gap-6 text-lg leading-relaxed text-pretty text-ink-soft md:grid-cols-2 md:gap-10">
            {t.paragraphs.map((paragraph, i) => (
              <Reveal key={i} delay={0.1 + i * 0.1}>
                <p>
                  <Rich text={paragraph} em="accent font-display text-[1.08em]" />
                </p>
              </Reveal>
            ))}
          </div>

          <dl className="mt-14 grid grid-cols-3 border-t border-line">
            {t.commitments.map((item, i) => (
              <Reveal
                key={item.value}
                delay={0.1 + i * 0.1}
                className={cn(
                  "py-6 pr-3 not-first:border-l not-first:pl-4 sm:py-8 sm:pr-6 sm:not-first:pl-6",
                  commitmentTones[i % commitmentTones.length],
                )}
              >
                <dt className="font-display text-[2.6rem] leading-none font-[340] tracking-[-0.04em] text-violet sm:text-[3.4rem]">
                  {item.value}
                </dt>
                <dd className="mt-3 max-w-[14rem] text-sm leading-snug text-ink-soft sm:text-[0.95rem]">{item.label}</dd>
              </Reveal>
            ))}
          </dl>

          <Signature name={name} />
        </div>
      </div>
    </section>
  );
}

function Portrait({ name, role }: { name: string; role: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);
  const reduce = useReducedMotion();

  return (
    <Reveal className="relative mx-auto max-w-[17rem] sm:max-w-[22rem] lg:sticky lg:top-28 lg:max-w-[26rem]">
      <div
        ref={ref}
        className="relative aspect-[4/5] overflow-hidden rounded-tl-[50%_40%] rounded-tr-[50%_40%] rounded-b-[2.5rem] border border-line/70 bg-night shadow-[0_40px_80px_-40px_var(--shadow-tint)]"
      >
        <motion.div aria-hidden style={reduce ? undefined : { y }} className="absolute -inset-[10%]">
          <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_70%_20%,oklch(0.68_0.2_300/0.9),transparent_70%),radial-gradient(70%_60%_at_15%_90%,oklch(0.66_0.2_15/0.8),transparent_70%),radial-gradient(55%_45%_at_95%_100%,oklch(0.8_0.15_70/0.6),transparent_70%),linear-gradient(180deg,oklch(0.33_0.14_292),oklch(0.2_0.08_292))]" />
          <motion.span
            style={reduce ? undefined : { rotate }}
            className="absolute inset-0 grid place-items-center font-display text-[18rem] leading-none text-white/90 italic [font-variation-settings:'SOFT'_100,'WONK'_1]"
          >
            T
          </motion.span>
        </motion.div>
        <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
          <motion.path
            d="M-20 380 C 80 360, 120 250, 200 270 S 300 420, 420 300"
            stroke="white"
            strokeOpacity="0.7"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.2, ease: EASE, delay: 0.3 }}
          />
        </svg>
        <div className="grain absolute inset-0 mix-blend-overlay" />
      </div>

      <div className="absolute -right-4 -bottom-6 flex items-center gap-3 rounded-2xl border border-line bg-surface/90 py-3 pr-5 pl-3 shadow-[0_20px_40px_-24px_var(--shadow-tint)] backdrop-blur-md sm:-right-6">
        <span aria-hidden className="grid size-10 place-items-center rounded-full bg-violet-soft font-display text-lg text-violet italic">
          T
        </span>
        <div className="leading-tight">
          <p className="font-medium text-ink">{name}</p>
          <p className="text-sm text-ink-soft">{role}</p>
        </div>
      </div>
    </Reveal>
  );
}

function Signature({ name }: { name: string }) {
  return (
    <Reveal delay={0.2} className="mt-12 flex items-center gap-4">
      <span aria-hidden className="font-display text-3xl text-ink italic [font-variation-settings:'SOFT'_100,'WONK'_1]">{name}</span>
      <svg viewBox="0 0 160 24" className="h-6 w-40 text-violet" fill="none" aria-hidden>
        <motion.path
          d="M2 16 C 30 16, 38 4, 30 4 C 22 4, 26 18, 48 16 S 120 10, 158 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.4 }}
        />
      </svg>
    </Reveal>
  );
}
