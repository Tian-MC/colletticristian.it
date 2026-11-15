"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ButtonArrow } from "@/components/brand";
import { Reveal } from "@/components/motion";
import { projectDomains } from "@/content/site";
import type { Dictionary, Project, ProjectKey } from "@/content/types";
import { cn } from "@/lib/utils";
import { SectionIntro } from "./section-intro";
import { ProjectPreview } from "./work-previews";

const cardTones: Record<ProjectKey, string> = {
  mascari: "tone-rose",
  ducato: "tone-coral",
  vip: "tone-sky",
  ensemble: "tone-rose",
};

const STACK_CLEARANCE = 112;

export function Work({
  t,
  id,
  caseHrefs,
}: {
  t: Dictionary["work"];
  id: string;
  caseHrefs: Record<ProjectKey, string>;
}) {
  const projects = t.projects;
  const stack = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const { scrollYProgress } = useScroll({ target: stack, offset: ["start start", "end end"] });
  const [stacked, setStacked] = useState(false);

  useEffect(() => {
    const evaluate = () => {
      if (window.innerWidth < 1024) return setStacked(false);
      const tallest = Math.max(0, ...cards.current.map((card) => card?.offsetHeight ?? 0));
      setStacked(tallest > 0 && tallest + STACK_CLEARANCE <= window.innerHeight);
    };
    evaluate();
    const observer = new ResizeObserver(evaluate);
    cards.current.forEach((card) => card && observer.observe(card));
    window.addEventListener("resize", evaluate);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", evaluate);
    };
  }, []);

  return (
    <section id={id} tabIndex={-1} className="tone-teal relative py-20 md:pt-24 md:pb-16">
      <div className="container-site">
        <SectionIntro
          eyebrow={t.eyebrow}
          title={t.title}
          lead={t.lead}
        />

        <div ref={stack} className={cn("relative mt-16 flex flex-col md:mt-20", stacked ? "gap-0" : "gap-6 lg:gap-8")}>
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              total={projects.length}
              progress={scrollYProgress}
              stacked={stacked}
              t={t}
              caseHref={caseHrefs[project.id]}
              cardRef={(el) => {
                cards.current[i] = el;
              }}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  total,
  progress,
  stacked,
  cardRef,
  t,
  caseHref,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  stacked: boolean;
  cardRef: (el: HTMLElement | null) => void;
  t: Dictionary["work"];
  caseHref: string;
}) {
  const domain = projectDomains[project.id];
  const targetScale = 1 - (total - 1 - index) * 0.045;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const dim = useTransform(progress, [index / total, 1], [0, (total - 1 - index) * 0.12]);
  const reduce = useReducedMotion();

  return (
    <div className={cn(stacked && "sticky top-0 flex h-[100svh] items-center")}>
      <motion.div
        style={stacked ? { scale: reduce ? 1 : scale, top: `calc(${index} * 1.1rem)` } : undefined}
        className={cn("relative w-full origin-top", stacked && "pt-20")}
      >
        <Reveal>
          <article
            ref={cardRef}
            className={cn(
              "group relative grid overflow-hidden rounded-[2.25rem] border border-line bg-surface shadow-[0_50px_100px_-60px_var(--shadow-tint)] lg:min-h-[34rem] lg:grid-cols-12",
              cardTones[project.id],
            )}
          >
            <span aria-hidden className="absolute inset-x-0 top-0 z-10 h-1.5 bg-linear-to-r from-cta to-orchid" />
            <div className="order-2 flex flex-col p-7 md:p-10 lg:order-1 lg:col-span-6 lg:p-9 xl:col-span-5 xl:p-11">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-ink-faint tabular-nums">
                  0{index + 1} / 0{total}
                </span>
                <span className="rounded-full bg-violet-soft px-3 py-1 text-[0.8rem] font-medium text-violet">
                  {project.tag}
                </span>
              </div>

              <p className="mt-7 font-display text-lg text-ink-soft italic [font-variation-settings:'SOFT'_100,'WONK'_1]">
                {project.kind}
              </p>
              <h3 className="mt-2 font-display text-[clamp(1.9rem,3vw,2.6rem)] leading-[1.05] font-[380] tracking-[-0.025em] text-balance">
                {project.name}
              </h3>

              <dl className="mt-8 space-y-4 text-[0.97rem] leading-relaxed lg:mt-auto lg:pt-8">
                <div>
                  <dt className="text-xs font-medium tracking-[0.16em] text-ink-faint uppercase">{t.labels.what}</dt>
                  <dd className="mt-1.5 text-ink-soft">{project.what}</dd>
                </div>
                <div className="relative rounded-2xl bg-violet-soft/60 p-4 pl-5">
                  <span aria-hidden className="absolute top-4 bottom-4 left-0 w-[2px] rounded-full bg-violet" />
                  <dt className="text-xs font-medium tracking-[0.16em] text-violet uppercase">{t.labels.highlight}</dt>
                  <dd className="mt-1.5 text-ink">{project.highlight}</dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <a href={caseHref} className="inline-flex w-fit items-center gap-2 rounded-full text-[0.95rem] font-medium text-violet underline decoration-violet/30 underline-offset-4 transition-colors hover:decoration-violet focus-visible:ring-[3px] focus-visible:ring-violet/45 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none">
                  {t.caseLink}
                  <span className="sr-only">: {project.name}</span>
                  <ButtonArrow />
                </a>
                {domain && (
                  <a
                    href={`https://${domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit items-center gap-2 rounded-full text-[0.95rem] font-medium text-violet underline decoration-violet/30 underline-offset-4 transition-colors hover:decoration-violet focus-visible:ring-[3px] focus-visible:ring-violet/45 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none"
                  >
                    {t.visit} {domain}
                    <ButtonArrow direction="up-right" />
                    <span className="sr-only">{t.newTab}</span>
                  </a>
                )}
              </div>
            </div>

            <div className="order-1 p-3 md:p-4 lg:order-2 lg:col-span-6 lg:pl-0 xl:col-span-7">
              <ProjectPreview id={project.id} label={project.previewLabel} barLabel={domain ?? project.name} />
            </div>

            {stacked && (
              <motion.div
                aria-hidden
                style={{ opacity: dim }}
                className="pointer-events-none absolute inset-0 rounded-[2.25rem] bg-paper"
              />
            )}
          </article>
        </Reveal>
      </motion.div>
    </div>
  );
}
