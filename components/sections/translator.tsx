"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { EASE, Reveal } from "@/components/motion";
import type { Dictionary } from "@/content/types";
import { cn } from "@/lib/utils";
import { SectionIntro } from "./section-intro";

const AUTO_DURATION = 4800;

export function Translator({ t }: { t: Dictionary["translator"] }) {
  const jargon = t.jargon;
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const [hovering, setHovering] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const inView = useInView(panel, { amount: 0.4 });
  const reduce = useReducedMotion();

  const playing = auto && !reduce;
  const paused = !inView || hovering;
  const entry = jargon[index];

  function select(i: number) {
    setAuto(false);
    setIndex(i);
  }

  return (
    <section className="tone-coral relative pb-20 md:pb-24">
      <div className="container-site">
        <div
          ref={panel}
          className="relative overflow-hidden rounded-[2.5rem] border border-line/80 bg-surface/70 px-6 py-14 shadow-[0_40px_100px_-60px_var(--shadow-tint)] backdrop-blur-sm md:px-14 md:py-20"
        >
          <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 size-[34rem] rounded-full bg-[radial-gradient(closest-side,var(--glow-1),transparent)]" />
          <div aria-hidden className="pointer-events-none absolute -bottom-48 -left-40 size-[30rem] rounded-full bg-[radial-gradient(closest-side,var(--glow-2),transparent)] opacity-70" />

          <div className="relative grid gap-14 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <SectionIntro
                eyebrow={t.eyebrow}
                title={t.title}
                titleClassName="text-[clamp(2.1rem,3.8vw,3.4rem)] leading-[1.04]"
                lead={t.lead}
              />

              <Reveal delay={0.2} className="mt-10">
                <p className="mb-4 text-sm text-ink-faint">{t.pick}</p>
                <div
                  className="flex flex-wrap gap-2"
                  onMouseEnter={() => setHovering(true)}
                  onMouseLeave={() => setHovering(false)}
                >
                  {jargon.map((item, i) => {
                    const active = i === index;
                    return (
                      <button
                        key={item.term}
                        type="button"
                        aria-pressed={active}
                        onClick={() => select(i)}
                        className={cn(
                          "relative overflow-hidden rounded-full border px-4 py-2 text-sm transition-[background-color,border-color,color] duration-300",
                          active
                            ? "border-transparent bg-cta text-on-cta"
                            : "border-line bg-paper/50 text-ink-soft hover:border-violet/40 hover:text-ink",
                        )}
                      >
                        {item.term}
                        {active && playing && (
                          <span
                            key={index}
                            aria-hidden
                            onAnimationEnd={() => setIndex((current) => (current + 1) % jargon.length)}
                            style={{
                              animation: `chip-progress ${AUTO_DURATION}ms linear forwards`,
                              animationPlayState: paused ? "paused" : "running",
                            }}
                            className="absolute inset-x-3 bottom-1 h-px origin-left bg-on-cta/70"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-6 lg:pl-6">
              <Reveal delay={0.15} className="h-full">
                <div
                  aria-live={auto ? "off" : "polite"}
                  className="relative flex h-full min-h-[22rem] flex-col justify-center rounded-[2rem] border border-line bg-paper/70 p-8 md:p-12"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={entry.term}
                      initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                      transition={{ duration: 0.55, ease: EASE }}
                    >
                      <p className="text-xs font-medium tracking-[0.18em] text-ink-faint uppercase">{t.heard}</p>
                      <p className="relative mt-3 inline-block text-xl font-medium whitespace-nowrap text-ink-faint sm:text-2xl md:text-[1.75rem]">
                        {entry.term}
                        <motion.span
                          aria-hidden
                          className="pointer-events-none absolute top-1/2 -left-[4%] block h-3 w-[108%] -translate-y-1/2"
                          initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
                          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                          transition={{ delay: 0.35, duration: 0.6, ease: EASE }}
                        >
                          <svg viewBox="0 0 100 12" preserveAspectRatio="none" className="block h-full w-full" fill="none">
                            <path
                              d="M1 7 C 18 3, 34 10, 52 6 S 84 3, 99 6"
                              className="stroke-violet"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </motion.span>
                      </p>

                      <svg viewBox="0 0 28 52" className="my-5 h-12 w-7 text-violet/60" fill="none" aria-hidden>
                        <motion.path
                          d="M10 2 C 22 14, 2 26, 14 46 M 7.5 39.5 L 14 47 L 20 39"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 0.55, duration: 0.7, ease: EASE }}
                        />
                      </svg>

                      <p className="text-xs font-medium tracking-[0.18em] text-violet uppercase">{t.plain}</p>
                      <p className="mt-3 font-display text-[1.9rem] leading-[1.15] font-[380] tracking-[-0.02em] text-balance text-ink md:text-[2.5rem]">
                        {entry.plain}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
