import { AnchorLink } from "@/components/anchor-link";
import { ButtonArrow, Eyebrow } from "@/components/brand";
import { Reveal } from "@/components/motion";
import { SiteFooter } from "@/components/sections/home";
import { ReviewCard } from "@/components/sections/reviews";
import { ProjectPreview } from "@/components/sections/work-previews";
import { Button } from "@/components/ui/button";
import { caseKeys, casePage, getDictionary, paths } from "@/content/i18n";
import { whatsappHref } from "@/content/site";
import type { CaseKey, Locale } from "@/content/types";
import { cn } from "@/lib/utils";
import { caseInfo, caseServices, caseTones, sameClient } from "./cases";
import { PageStructuredData } from "./page-structured-data";
import {
  Breadcrumbs,
  CardGrid,
  CaseCard,
  ContactButton,
  PageCta,
  PageHero,
  SectionHeading,
} from "./page-parts";
import { serviceTones } from "@/lib/tones";

export function CaseStudyPage({ locale, caseKey }: { locale: Locale; caseKey: CaseKey }) {
  const t = getDictionary(locale);
  const page = t.pages.cases[caseKey];
  const common = t.pages.common;
  const info = caseInfo(t, caseKey);
  const domain = info.domain;
  const review = page.review ? t.reviews.items.find((item) => item.name === page.review) : undefined;
  const others = caseKeys
    .filter((key) => key !== caseKey)
    .sort((a, b) => Number(b === sameClient[caseKey]) - Number(a === sameClient[caseKey]));
  const whatsapp = whatsappHref(t.contactInfo.whatsappText);
  const serviceKey = caseServices[caseKey];
  const service = t.pages.services[serviceKey];

  return (
    <>
      <PageStructuredData locale={locale} page={casePage(caseKey)} />
      <main id={t.ids.main} className={caseTones[caseKey]}>
        <PageHero
          breadcrumbs={
            <Breadcrumbs
              label={common.breadcrumbLabel}
              items={[
                { name: common.breadcrumbHome, href: paths.home[locale] },
                { name: t.work.eyebrow, href: `#${t.ids.work}` },
                { name: page.nav },
              ]}
            />
          }
          eyebrow={page.eyebrow}
          title={page.title}
          lead={page.lead}
          actions={
            domain ? (
              <>
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <a href={`https://${domain}`} target="_blank" rel="noopener noreferrer">
                    {t.work.visit} {domain}
                    <ButtonArrow direction="up-right" />
                    <span className="sr-only">{t.work.newTab}</span>
                  </a>
                </Button>
                <Button asChild size="lg" variant="ghost" className="group">
                  <AnchorLink href={`#${t.ids.contact}`}>
                    {t.cta.primary}
                    <ButtonArrow />
                  </AnchorLink>
                </Button>
              </>
            ) : (
              <>
                <ContactButton ids={t.ids} label={t.cta.primary} />
                <Button asChild size="lg" variant="ghost" className="group">
                  <a href={paths[serviceKey][locale]}>
                    {common.learnMore}: {service.nav}
                    <ButtonArrow />
                  </a>
                </Button>
              </>
            )
          }
        />

        <section className="relative pb-16 md:pb-20">
          <div className="container-site grid gap-6 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-8">
              <div className="group h-full rounded-[2.25rem] border border-line bg-surface p-3 shadow-[0_50px_100px_-60px_var(--shadow-tint)] md:p-4">
                <ProjectPreview id={caseKey} label={info.previewLabel} barLabel={domain ?? info.name} />
              </div>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-4">
              <div className="relative h-full overflow-hidden rounded-[2.25rem] border border-line bg-surface p-7 md:p-8">
                <span aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-cta to-orchid" />
                <h2 className="text-xs font-medium tracking-[0.18em] text-ink-faint uppercase">{common.factsTitle}</h2>
                <dl className="mt-5 divide-y divide-line">
                  {page.facts.map((fact) => (
                    <div key={fact.label} className="flex flex-col gap-0.5 py-3.5 first:pt-0">
                      <dt className="text-sm text-ink-faint">{fact.label}</dt>
                      <dd className="font-medium text-ink">{fact.value}</dd>
                    </div>
                  ))}
                  {domain && (
                    <div className="flex flex-col gap-0.5 py-3.5">
                      <dt className="text-sm text-ink-faint">Online</dt>
                      <dd>
                        <a
                          href={`https://${domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium break-all text-violet underline decoration-violet/30 underline-offset-4 transition-colors hover:decoration-violet"
                        >
                          {domain}
                          <span className="sr-only"> {t.work.newTab}</span>
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="relative py-20 md:py-24">
          <div className="container-site grid gap-8 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Reveal y={12}>
                <Eyebrow as="h2">{page.brief.title}</Eyebrow>
              </Reveal>
            </div>
            <Reveal delay={0.1} className="lg:col-span-8">
              <p className="font-display text-[clamp(1.5rem,2.6vw,2.2rem)] leading-[1.25] font-[360] tracking-[-0.015em] text-pretty text-ink">
                {page.brief.text}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="relative py-20 md:py-24">
          <div className="container-site">
            <SectionHeading eyebrow={page.build.eyebrow} title={page.build.title} />
            <div className="mt-12 md:mt-16">
              <CardGrid items={page.build.items} />
            </div>

            <div className={cn("mt-6 grid gap-4 lg:mt-8 lg:gap-5", page.highlights.length > 1 && "lg:grid-cols-2")}>
              {page.highlights.map((highlight, i) => (
                <Reveal key={highlight.title} delay={i * 0.08} className="flex">
                  <div className="relative w-full rounded-[2rem] bg-violet-soft/60 p-7 pl-8 md:p-10 md:pl-12">
                    <span aria-hidden className="absolute top-8 bottom-8 left-0 w-[2px] rounded-full bg-violet" />
                    <p className="text-xs font-medium tracking-[0.16em] text-violet uppercase">{highlight.title}</p>
                    <p className="mt-3 max-w-3xl font-display text-[1.45rem] leading-snug tracking-[-0.01em] text-pretty text-ink md:text-[1.6rem]">
                      {highlight.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {review && (
          <section className="relative py-12 md:py-16">
            <div className="container-site grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-4">
                <Reveal y={12}>
                  <Eyebrow>{common.reviewEyebrow}</Eyebrow>
                </Reveal>
              </div>
              <Reveal delay={0.1} className="flex lg:col-span-8">
                <ReviewCard review={review} />
              </Reveal>
            </div>
          </section>
        )}

        <section className="relative py-20 md:py-24">
          <div className="container-site">
            <Reveal y={10}>
              <h2 className="text-xs font-medium tracking-[0.18em] text-ink-faint uppercase">{common.otherCasesTitle}</h2>
            </Reveal>
            <ul className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {others.map((key, i) => {
                const other = caseInfo(t, key);
                return (
                  <li key={key}>
                    <Reveal delay={i * 0.07} className="h-full">
                      <CaseCard
                        href={paths[casePage(key)][locale]}
                        name={other.name}
                        kind={other.kind}
                        linkLabel={t.work.caseLink}
                        tone={caseTones[key]}
                        image={other.image}
                        imageSrcSet={other.imageSrcSet}
                        barLabel={other.domain ?? other.name}
                        anchorLeft={!other.domain}
                      />
                    </Reveal>
                  </li>
                );
              })}
              <li className={serviceTones[serviceKey]}>
                <Reveal delay={0.21} className="h-full">
                  <a
                    href={paths[serviceKey][locale]}
                    className="group relative flex h-full min-h-[16rem] flex-col justify-between overflow-hidden rounded-[2rem] border border-line bg-violet-soft/50 p-7 transition-[border-color,translate] duration-500 ease-silk hover:-translate-y-1 hover:border-violet/40 md:p-8"
                  >
                    <div aria-hidden className="pointer-events-none absolute -top-20 -right-20 size-60 rounded-full bg-[radial-gradient(closest-side,var(--glow-1),transparent)]" />
                    <span className="relative text-sm font-medium text-violet">{service.eyebrow}</span>
                    <span className="relative">
                      <span className="block font-display text-[1.8rem] leading-tight tracking-[-0.02em] text-balance text-ink">{service.nav}</span>
                      <span className="mt-5 inline-flex items-center gap-2 text-[0.95rem] font-medium text-violet">
                        {common.learnMore}
                        <ButtonArrow />
                      </span>
                    </span>
                  </a>
                </Reveal>
              </li>
            </ul>
          </div>
        </section>

        <PageCta common={common} ids={t.ids} cta={t.cta} whatsappHref={whatsapp} whatsappLabel={t.ui.whatsappLabel} />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
