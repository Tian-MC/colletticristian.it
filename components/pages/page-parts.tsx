import type { ReactNode } from "react";
import { AnchorLink } from "@/components/anchor-link";
import { ButtonArrow, Eyebrow, WhatsAppIcon } from "@/components/brand";
import { Reveal, WordsReveal } from "@/components/motion";
import { Rich } from "@/components/rich";
import { BrowserBar } from "@/components/sections/work-previews";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/content/types";
import { cn } from "@/lib/utils";

export function Breadcrumbs({ label, items }: { label: string; items: { name: string; href?: string }[] }) {
  return (
    <nav aria-label={label}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-faint">
        {items.map((item, i) => (
          <li key={item.name} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>/</span>}
            {item.href ? (
              item.href.startsWith("#") ? (
                <AnchorLink href={item.href} className="transition-colors hover:text-violet">
                  {item.name}
                </AnchorLink>
              ) : (
                <a href={item.href} className="transition-colors hover:text-violet">
                  {item.name}
                </a>
              )
            ) : (
              <span aria-current="page" className="text-ink-soft">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({
  breadcrumbs,
  eyebrow,
  title,
  lead,
  actions,
  children,
}: {
  breadcrumbs: ReactNode;
  eyebrow: string;
  title: string;
  lead: string;
  actions: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative pt-32 pb-14 md:pt-40 md:pb-20">
      <div className="container-site">
        <Reveal immediate y={10}>{breadcrumbs}</Reveal>
        <Reveal immediate y={12} delay={0.1} className="mt-10 md:mt-14">
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
        <WordsReveal
          as="h1"
          immediate
          delay={0.2}
          stagger={0.05}
          text={title}
          className="mt-6 max-w-5xl font-display text-[clamp(2.7rem,6.2vw,5.8rem)] leading-[0.98] font-[360] tracking-[-0.035em] text-balance text-ink"
        />
        <Reveal immediate delay={0.55} className="mt-8 max-w-2xl md:mt-10">
          <p className="text-lg leading-relaxed text-pretty text-ink-soft md:text-xl md:leading-relaxed">
            <Rich text={lead} strong="font-medium text-ink" />
          </p>
        </Reveal>
        <Reveal immediate delay={0.7} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          {actions}
        </Reveal>
        {children}
      </div>
    </section>
  );
}

export function ContactButton({ ids, label }: { ids: Dictionary["ids"]; label: string }) {
  return (
    <Button asChild size="lg" className="w-full sm:w-auto">
      <AnchorLink href={`#${ids.contact}`}>
        {label}
        <ButtonArrow />
      </AnchorLink>
    </Button>
  );
}

export function SectionHeading({ eyebrow, title, className }: { eyebrow: string; title: string; className?: string }) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <Reveal y={12}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <WordsReveal
        text={title}
        className="mt-5 font-display text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.02] font-[380] tracking-[-0.028em] text-balance text-ink"
      />
    </div>
  );
}

export function CardGrid({ items, columns = 3 }: { items: { title: string; text: string }[]; columns?: 2 | 3 }) {
  return (
    <ul className={cn("grid gap-4 md:grid-cols-2 lg:gap-5", columns === 3 && "lg:grid-cols-3")}>
      {items.map((item, i) => (
        <li key={item.title} className="flex">
          <Reveal delay={(i % 3) * 0.07} className="flex w-full">
            <div className="relative flex w-full flex-col overflow-hidden rounded-[2rem] border border-line bg-surface p-7 shadow-[0_40px_80px_-60px_var(--shadow-tint)] md:p-8">
              <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-56 rounded-full bg-[radial-gradient(closest-side,var(--glow-1),transparent)] opacity-70" />
              <span aria-hidden className="relative text-sm font-medium text-violet tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="relative mt-4 font-display text-[1.6rem] leading-tight tracking-[-0.02em] text-balance text-ink">{item.title}</h3>
              <p className="relative mt-3 leading-relaxed text-pretty text-ink-soft">{item.text}</p>
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

export function GroupCards({
  groups,
  tones,
}: {
  groups: { title?: string; items: { title: string; text: string }[] }[];
  tones: string[];
}) {
  return (
    <ul className="grid gap-4 lg:grid-cols-3 lg:gap-5">
      {groups.map((group, i) => (
        <li key={group.title ?? i} className={cn("flex", tones[i % tones.length])}>
          <Reveal delay={i * 0.07} className="flex w-full">
            <div className="relative flex w-full flex-col overflow-hidden rounded-[2rem] border border-line bg-surface p-7 shadow-[0_40px_80px_-60px_var(--shadow-tint)] md:p-8">
              <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-56 rounded-full bg-[radial-gradient(closest-side,var(--glow-1),transparent)] opacity-70" />
              <span aria-hidden className="relative text-sm font-medium text-violet tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="relative mt-4 font-display text-[1.75rem] leading-tight tracking-[-0.02em] text-balance text-ink">{group.title}</h3>
              <ul className="relative mt-6 space-y-5 border-t border-line pt-6">
                {group.items.map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span aria-hidden className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-violet" />
                    <div>
                      <h4 className="font-medium leading-snug text-ink">{item.title}</h4>
                      <p className="mt-1 text-[0.95rem] leading-relaxed text-pretty text-ink-soft">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

export function PageFaq({ eyebrow, title, items }: { eyebrow: string; title: string; items: { q: string; a: string }[] }) {
  return (
    <section className="relative py-20 md:py-24">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading eyebrow={eyebrow} title={title} />
          </div>
        </div>
        <Reveal delay={0.1} className="lg:col-span-7">
          <Accordion type="single" collapsible defaultValue="item-0">
            {items.map((faq, i) => (
              <AccordionItem key={faq.q} value={`item-${i}`}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

export function PageCta({
  common,
  ids,
  cta,
  whatsappHref,
  whatsappLabel,
}: {
  common: Dictionary["pages"]["common"];
  ids: Dictionary["ids"];
  cta: Dictionary["cta"];
  whatsappHref: string;
  whatsappLabel: string;
}) {
  return (
    <section className="relative py-16 md:py-20">
      <div className="container-site">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-line bg-surface/80 px-6 py-16 text-center shadow-[0_50px_100px_-60px_var(--shadow-tint)] backdrop-blur-sm md:px-14 md:py-24">
            <div aria-hidden className="pointer-events-none absolute -top-32 -right-24 size-[28rem] rounded-full bg-[radial-gradient(closest-side,var(--glow-1),transparent)]" />
            <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-24 size-[26rem] rounded-full bg-[radial-gradient(closest-side,var(--glow-2),transparent)]" />
            <div aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-cta to-orchid" />
            <div className="relative mx-auto max-w-3xl">
              <div className="flex justify-center">
                <Eyebrow>{common.ctaEyebrow}</Eyebrow>
              </div>
              <WordsReveal
                text={common.ctaTitle}
                className="mt-6 font-display text-[clamp(2.1rem,4.6vw,3.9rem)] leading-[1.02] font-[380] tracking-[-0.03em] text-balance text-ink"
              />
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">{common.ctaText}</p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <ContactButton ids={ids} label={cta.primary} />
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon />
                    {whatsappLabel}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function CaseCard({
  href,
  name,
  kind,
  linkLabel,
  tone,
  image,
  imageSrcSet,
  barLabel,
  anchorLeft = false,
}: {
  href: string;
  name: string;
  kind: string;
  linkLabel: string;
  tone: string;
  image: string;
  imageSrcSet?: string;
  barLabel: string;
  anchorLeft?: boolean;
}) {
  return (
    <a
      href={href}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-line bg-surface shadow-[0_40px_80px_-60px_var(--shadow-tint)] transition-[border-color,translate] duration-500 ease-silk hover:-translate-y-1 hover:border-violet/40",
        tone,
      )}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 z-10 h-1.5 bg-linear-to-r from-cta to-orchid" />
      <div className="relative bg-violet-soft/60 p-4 pb-0">
        <div className="overflow-hidden rounded-t-xl border border-b-0 border-line/60 bg-surface">
          <BrowserBar url={barLabel} />
          <div className="relative aspect-[16/10] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element -- export statico: Next non ottimizza le immagini */}
            <img
              src={image}
              srcSet={imageSrcSet}
              sizes="(min-width: 1024px) 360px, (min-width: 768px) 45vw, 85vw"
              alt=""
              loading="lazy"
              decoding="async"
              className={cn(
                "absolute inset-0 size-full object-cover transition-transform duration-[1.4s] ease-silk group-hover:scale-[1.03]",
                anchorLeft ? "origin-top-left object-left-top" : "object-top",
              )}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <p className="font-display text-ink-soft italic [font-variation-settings:'SOFT'_100,'WONK'_1]">{kind}</p>
        <p className="mt-1 font-display text-[1.6rem] leading-tight tracking-[-0.02em] text-ink">{name}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[0.95rem] font-medium text-violet">
          {linkLabel}
          <ButtonArrow />
        </span>
      </div>
    </a>
  );
}
