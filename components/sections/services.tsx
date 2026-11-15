"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { AnchorLink } from "@/components/anchor-link";
import { ButtonArrow } from "@/components/brand";
import { EASE, Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import type { Dictionary, ServiceArtKey } from "@/content/types";
import { cn } from "@/lib/utils";
import { SectionIntro } from "./section-intro";
import { ServiceArt } from "./service-art";

const serviceTones = ["tone-violet", "tone-rose", "tone-coral", "tone-teal", "tone-sky"];

export function Services({
  t,
  ids,
  cta,
  more,
}: {
  t: Dictionary["services"];
  ids: Dictionary["ids"];
  cta: Dictionary["cta"];
  more: { label: string; links: Record<ServiceArtKey, { href: string; name: string }> };
}) {
  const services = t.items;
  const [active, setActive] = useState(0);
  const current = services[active];

  return (
    <section id={ids.services} tabIndex={-1} className="relative py-20 md:py-24">
      <div className="container-site">
        <SectionIntro
          eyebrow={t.eyebrow}
          title={t.title}
          lead={t.lead}
        />

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <ol className="border-t border-line">
              {services.map((service, i) => {
                const open = i === active;
                return (
                  <li key={service.id} className={cn("relative border-b border-line", serviceTones[i % serviceTones.length])}>
                    <motion.span
                      aria-hidden
                      initial={false}
                      animate={{ scaleY: open ? 1 : 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="absolute top-0 -left-px h-full w-[2px] origin-top bg-linear-to-b from-violet to-orchid max-md:hidden"
                    />
                    <h3>
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={`servizio-${service.id}`}
                        onClick={() => setActive(i)}
                        className="group flex w-full items-start gap-5 py-7 text-left md:gap-8 md:py-9 md:pl-6"
                      >
                        <span
                          aria-hidden
                          data-n={`0${i + 1}`}
                          className="w-7 shrink-0 pt-[0.55em] text-sm text-ink-faint tabular-nums before:content-[attr(data-n)] md:pt-[0.9em]"
                        />
                        <span
                          className={cn(
                            "flex-1 font-display text-[clamp(1.55rem,2.9vw,2.45rem)] leading-[1.1] font-[380] tracking-[-0.02em] text-balance transition-[color,translate] duration-500 ease-silk",
                            open ? "text-ink" : "text-ink-soft group-hover:translate-x-2 group-hover:text-ink",
                          )}
                        >
                          {service.title}
                        </span>
                        <span
                          aria-hidden
                          className={cn(
                            "relative mt-1 grid size-10 shrink-0 place-items-center rounded-full border transition-[background-color,border-color,color,rotate] duration-500 ease-silk md:mt-2",
                            open
                              ? "rotate-45 border-transparent bg-cta text-on-cta"
                              : "border-line text-ink group-hover:border-violet/50",
                          )}
                        >
                          <span className="absolute h-px w-3.5 bg-current" />
                          <span className="absolute h-3.5 w-px bg-current" />
                        </span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          id={`servizio-${service.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.65, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <div className="pb-10 pl-12 md:pl-[5.5rem]">
                            <p className="max-w-xl text-lg leading-relaxed text-pretty text-ink-soft">{service.lead}</p>

                            <div className="mt-8 aspect-[320/260] max-w-xs rounded-3xl border border-line bg-violet-soft/40 p-4 lg:hidden">
                              <ServiceArt id={service.id} />
                            </div>

                            <p className="mt-7 text-sm text-ink-faint">{t.examplesLabel}</p>
                            <ul className="mt-3 flex flex-wrap gap-2">
                              {service.examples.map((example, j) => (
                                <motion.li
                                  key={example}
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2 + j * 0.05, duration: 0.5, ease: EASE }}
                                  className="rounded-full border border-violet/20 bg-violet-soft/60 px-3.5 py-1.5 text-sm text-ink"
                                >
                                  {example}
                                </motion.li>
                              ))}
                            </ul>

                            <a
                              href={more.links[service.id].href}
                              className="group mt-7 inline-flex w-fit items-center gap-2 text-[0.95rem] font-medium text-violet underline decoration-violet/30 underline-offset-4 transition-colors hover:decoration-violet"
                            >
                              {more.label}: {more.links[service.id].name}
                              <ButtonArrow />
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ol>
          </Reveal>

          <div className="hidden lg:col-span-5 lg:block">
            <Reveal delay={0.15} className={cn("sticky top-28", serviceTones[active % serviceTones.length])}>
              <div className="relative overflow-hidden rounded-[2.25rem] border border-line bg-surface/70 p-8 shadow-[0_40px_90px_-60px_var(--shadow-tint)] backdrop-blur-sm">
                <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-[radial-gradient(closest-side,var(--glow-1),transparent)]" />
                <div className="relative aspect-[320/260]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.id}
                      className="absolute inset-0"
                      exit={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
                      transition={{ duration: 0.3 }}
                    >
                      <ServiceArt id={current.id} />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="relative mt-6 border-t border-line pt-6">
                  <p className="text-xs font-medium tracking-[0.18em] text-ink-faint uppercase">{t.sidebarLabel}</p>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={current.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="mt-2 min-h-[3.5rem] font-display text-xl leading-snug text-ink"
                    >
                      {current.idealFor}
                    </motion.p>
                  </AnimatePresence>
                  <Button asChild variant="outline" className="mt-6">
                    <AnchorLink href={`#${ids.contact}`}>
                      {cta.primary}
                      <ButtonArrow />
                    </AnchorLink>
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
