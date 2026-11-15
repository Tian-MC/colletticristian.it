import { ButtonArrow, Eyebrow } from "@/components/brand";
import { Reveal } from "@/components/motion";
import { SiteFooter } from "@/components/sections/home";
import { ReviewCard } from "@/components/sections/reviews";
import { Button } from "@/components/ui/button";
import { AnchorLink } from "@/components/anchor-link";
import { casePage, getDictionary, paths, projectKeys, serviceKeys } from "@/content/i18n";
import { whatsappHref } from "@/content/site";
import type { CaseKey, Locale, ServiceKey } from "@/content/types";
import { caseInfo, caseTones } from "./cases";
import { serviceTones } from "@/lib/tones";
import { cn } from "@/lib/utils";
import { PageStructuredData } from "./page-structured-data";
import {
  Breadcrumbs,
  CardGrid,
  CaseCard,
  ContactButton,
  GroupCards,
  PageCta,
  PageFaq,
  PageHero,
  SectionHeading,
} from "./page-parts";

const relatedCases: Record<ServiceKey, CaseKey[]> = {
  websites: [...projectKeys],
  software: ["ensemble"],
  support: [],
};

const showProcess: Record<ServiceKey, boolean> = {
  websites: true,
  software: true,
  support: false,
};

const stepTones = ["tone-violet", "tone-rose", "tone-coral", "tone-teal"];

const groupTones = ["tone-teal", "tone-sky", "tone-green"];

export function ServicePage({ locale, service }: { locale: Locale; service: ServiceKey }) {
  const t = getDictionary(locale);
  const page = t.pages.services[service];
  const common = t.pages.common;
  const review = page.review ? t.reviews.items.find((item) => item.name === page.review) : undefined;
  const cases = relatedCases[service];
  const others = serviceKeys.filter((key) => key !== service);
  const whatsapp = whatsappHref(t.contactInfo.whatsappText);

  return (
    <>
      <PageStructuredData locale={locale} page={service} />
      <main id={t.ids.main} className={serviceTones[service]}>
        <PageHero
          breadcrumbs={
            <Breadcrumbs
              label={common.breadcrumbLabel}
              items={[{ name: common.breadcrumbHome, href: paths.home[locale] }, { name: page.nav }]}
            />
          }
          eyebrow={page.eyebrow}
          title={page.title}
          lead={page.lead}
          actions={
            <>
              <ContactButton ids={t.ids} label={t.cta.primary} />
              <Button asChild size="lg" variant="ghost" className="group">
                <AnchorLink href={`#${t.ids.work}`}>
                  {common.seeWork}
                  <ButtonArrow />
                </AnchorLink>
              </Button>
            </>
          }
        />

        <section className="relative py-20 md:py-24">
          <div className="container-site">
            <SectionHeading eyebrow={page.offer.eyebrow} title={page.offer.title} />
            <div className="mt-12 md:mt-16">
              {page.offer.groups.some((group) => group.title) ? (
                <GroupCards groups={page.offer.groups} tones={groupTones} />
              ) : (
                <div className="space-y-12">
                  {page.offer.groups.map((group, i) => (
                    <CardGrid key={i} items={group.items} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="relative py-20 md:py-24">
          <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <SectionHeading eyebrow={page.how.eyebrow} title={page.how.title} />
                <Reveal delay={0.1} className="mt-10">
                  <div className="relative rounded-[2rem] bg-violet-soft/60 p-6 pl-7 md:p-8 md:pl-9">
                    <span aria-hidden className="absolute top-7 bottom-7 left-0 w-[2px] rounded-full bg-violet" />
                    <p className="text-xs font-medium tracking-[0.16em] text-violet uppercase">{page.audience.title}</p>
                    <ul className="mt-4 space-y-3">
                      {page.audience.items.map((item) => (
                        <li key={item} className="flex gap-3 leading-relaxed text-ink">
                          <svg viewBox="0 0 16 16" className="mt-1 size-4 shrink-0 text-violet" fill="none" aria-hidden>
                            <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </div>
            </div>

            <ol className="border-t border-line lg:col-span-7">
              {page.how.items.map((item, i) => (
                <li key={item.title}>
                  <Reveal delay={i * 0.05}>
                    <div className="grid gap-2 border-b border-line py-7 md:grid-cols-[2.5rem_1fr] md:gap-6 md:py-8">
                      <span aria-hidden className="pt-1 text-sm text-ink-faint tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-display text-[1.6rem] leading-tight tracking-[-0.02em] text-ink">{item.title}</h3>
                        <p className="mt-2 max-w-xl leading-relaxed text-pretty text-ink-soft">{item.text}</p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {(cases.length > 0 || review) && (
          <section className="relative py-20 md:py-24">
            <div className="container-site">
              {cases.length > 0 && (
                <>
                  <SectionHeading eyebrow={common.relatedEyebrow} title={page.relatedTitle ?? common.relatedTitle} />
                  <ul className="mt-12 grid gap-5 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
                    {cases.map((key, i) => {
                      const info = caseInfo(t, key);
                      return (
                        <li key={key}>
                          <Reveal delay={i * 0.07} className="h-full">
                            <CaseCard
                              href={paths[casePage(key)][locale]}
                              name={info.name}
                              kind={info.kind}
                              linkLabel={t.work.caseLink}
                              tone={caseTones[key]}
                              image={info.image}
                              imageSrcSet={info.imageSrcSet}
                              barLabel={info.domain ?? info.name}
                              anchorLeft={!info.domain}
                            />
                          </Reveal>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}

              {review && (
                <div className={cn("grid gap-8 lg:grid-cols-12 lg:items-center", cases.length > 0 && "mt-16 md:mt-20")}>
                  <div className="lg:col-span-4">
                    <Reveal y={12}>
                      <Eyebrow>{t.reviews.eyebrow}</Eyebrow>
                    </Reveal>
                  </div>
                  <Reveal delay={0.1} className="flex lg:col-span-8">
                    <ReviewCard
                      review={review}
                      caseHref={review.caseKey && paths[casePage(review.caseKey)][locale]}
                      caseLink={t.work.caseLink}
                    />
                  </Reveal>
                </div>
              )}
            </div>
          </section>
        )}

        {showProcess[service] && (
          <section className="relative py-20 md:py-24">
            <div className="container-site">
              <SectionHeading eyebrow={common.processEyebrow} title={common.processTitle} />
              <ol className="mt-12 grid gap-8 md:mt-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                {t.approach.steps.map((step, i) => (
                  <li key={step.title} className={stepTones[i % stepTones.length]}>
                    <Reveal delay={i * 0.07}>
                      <span aria-hidden className="grid size-9 place-items-center rounded-full bg-cta text-sm font-medium text-on-cta shadow-[0_0_0_6px_var(--violet-soft)]">
                        {i + 1}
                      </span>
                      <h3 className="mt-5 font-display text-[1.5rem] leading-tight tracking-[-0.02em] text-ink">{step.title}</h3>
                      <p className="mt-2 leading-relaxed text-pretty text-ink-soft">{step.text}</p>
                      <p className="mt-4 inline-flex rounded-full bg-violet-soft px-3 py-1 text-sm font-medium text-violet">{step.detail}</p>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        <PageFaq eyebrow={common.faqEyebrow} title={common.faqTitle} items={page.faq} />

        <section className="relative pb-4 md:pb-8">
          <div className="container-site">
            <Reveal y={10}>
              <p className="text-xs font-medium tracking-[0.18em] text-ink-faint uppercase">{common.otherServicesTitle}</p>
            </Reveal>
            <ul className="mt-5 grid gap-4 md:grid-cols-2">
              {others.map((key, i) => {
                const other = t.pages.services[key];
                return (
                  <li key={key} className={serviceTones[key]}>
                    <Reveal delay={i * 0.07} className="h-full">
                      <a
                        href={paths[key][locale]}
                        className="group flex h-full items-center justify-between gap-6 rounded-[1.75rem] border border-line bg-surface/70 p-6 transition-[border-color,background-color] duration-500 ease-silk hover:border-violet/40 hover:bg-surface md:p-7"
                      >
                        <span>
                          <span className="block text-sm font-medium text-violet">{other.eyebrow}</span>
                          <span className="mt-1 block font-display text-[1.5rem] leading-tight tracking-[-0.02em] text-ink">{other.nav}</span>
                        </span>
                        <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors group-hover:border-violet/50 group-hover:text-violet">
                          <ButtonArrow />
                        </span>
                      </a>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <PageCta common={common} ids={t.ids} cta={t.cta} whatsappHref={whatsapp} whatsappLabel={t.ui.whatsappLabel} />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
