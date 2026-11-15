"use client";

import { AnchorLink } from "@/components/anchor-link";
import { ButtonArrow } from "@/components/brand";
import { enterProps, Magnetic, Reveal, WordsReveal } from "@/components/motion";
import { Rich } from "@/components/rich";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/content/types";
import { cn } from "@/lib/utils";
import { HeroThread } from "./hero-thread";

const checkTones = ["tone-green", "tone-coral", "tone-sky"];

const badgeEnter = enterProps(0.2, 12);
const subtitleEnter = enterProps(0.75, 14);

export function Hero({ t, ids }: { t: Dictionary["hero"] & { cta: Dictionary["cta"] }; ids: Dictionary["ids"] }) {
  return (
    <section
      id={ids.top}
      tabIndex={-1}
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden pt-28 pb-44 md:pt-36 md:pb-32"
    >
      <ThreadField />
      <HeroThread noteBefore={t.noteBefore} noteAfter={t.noteAfter} />

      <div className="container-site relative z-10">
        <p
          style={badgeEnter.style}
          className={cn(
            badgeEnter.className,
            "mb-7 inline-flex items-center gap-3 rounded-full border border-line/80 bg-surface/50 py-1.5 pr-4 pl-3 text-sm text-ink-soft backdrop-blur-md md:mb-10",
          )}
        >
          <span className="relative flex size-2">
            <span className="absolute inset-0 rounded-full bg-green [animation:soft-pulse_2.4s_ease-out_infinite]" />
            <span className="relative size-2 rounded-full bg-green" />
          </span>
          {t.badge}
        </p>

        <h1>
          <WordsReveal
            as="span"
            immediate
            delay={0.3}
            stagger={0.07}
            text={t.title}
            className="rainbow-em block font-display text-[clamp(3.3rem,7.4vw,7.6rem)] leading-[0.94] font-[360] tracking-[-0.035em] text-balance text-ink"
          />
          <span
            style={subtitleEnter.style}
            className={cn(
              subtitleEnter.className,
              "mt-7 block max-w-[36rem] text-lg leading-snug font-medium text-balance text-ink md:mt-9 md:text-xl",
            )}
          >
            {t.subtitle}
          </span>
        </h1>

        <Reveal immediate delay={0.85} className="mt-4 max-w-[36rem] md:mt-5">
          <p className="text-lg leading-relaxed text-pretty text-ink-soft md:text-xl md:leading-relaxed">
            <Rich text={t.intro} strong="font-medium text-ink" em="text-ink not-italic" />
          </p>
        </Reveal>

        <Reveal immediate delay={1} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Magnetic>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <AnchorLink href={`#${ids.contact}`}>
                {t.cta.primary}
                <ButtonArrow />
              </AnchorLink>
            </Button>
          </Magnetic>
          <Button asChild size="lg" variant="ghost" className="group">
            <AnchorLink href={`#${ids.work}`}>
              {t.secondary}
              <ButtonArrow direction="down" />
            </AnchorLink>
          </Button>
        </Reveal>

        <Reveal immediate delay={1.15}>
          <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-soft">
            {t.reassurance.map((item, i) => (
              <li key={item} className={cn("flex items-center gap-2", checkTones[i % checkTones.length])}>
                <svg viewBox="0 0 16 16" className="size-4 text-violet" fill="none" aria-hidden>
                  <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function ThreadField() {
  const lines = Array.from({ length: 16 }, (_, i) => {
    const y = 60 + i * 52;
    const a = 18 + (i % 4) * 6;
    return `M-40 ${y} C 300 ${y - a}, 520 ${y + a * 1.6}, 760 ${y} S 1240 ${y - a * 1.4}, 1480 ${y + a * 0.4}`;
  });
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 900"
      preserveAspectRatio="none"
      className="thread-field pointer-events-none absolute inset-0 h-full w-full text-violet opacity-[0.18] dark:opacity-[0.22]"
      fill="none"
    >
      {lines.map((d, i) => (
        <path key={i} d={d} stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}
