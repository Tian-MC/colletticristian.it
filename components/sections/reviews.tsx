import { ButtonArrow } from "@/components/brand";
import type { CaseKey, Dictionary, Review } from "@/content/types";
import { cn } from "@/lib/utils";
import { ReviewRail } from "./review-rail";
import { SectionIntro } from "./section-intro";

const tones = ["tone-violet", "tone-coral", "tone-teal", "tone-rose", "tone-sky", "tone-green"];

export function Reviews({
  t,
  id,
  caseHrefs,
  caseLink,
}: {
  t: Dictionary["reviews"];
  id: string;
  caseHrefs: Record<CaseKey, string>;
  caseLink: string;
}) {
  if (t.items.length === 0) return null;

  return (
    <section id={id} tabIndex={-1} className="tone-rose relative py-20 md:py-24">
      <ReviewRail intro={<SectionIntro eyebrow={t.eyebrow} title={t.title} lead={t.lead} />} label={t.eyebrow} prev={t.prev} next={t.next}>
        {t.items.map((review, i) => (
          <li key={i} className={cn("flex w-[85%] max-w-[24rem] shrink-0 snap-start sm:w-[22rem] lg:w-[24rem]", tones[i % tones.length])}>
            <ReviewCard
              review={review}
              caseHref={review.caseKey && caseHrefs[review.caseKey]}
              caseLink={caseLink}
            />
          </li>
        ))}
      </ReviewRail>
    </section>
  );
}

export function ReviewCard({
  review,
  caseHref,
  caseLink,
}: {
  review: Review;
  caseHref?: string;
  caseLink?: string;
}) {
  const initials = review.name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <figure className="relative flex w-full flex-col overflow-hidden rounded-[2rem] border border-line bg-surface p-7 shadow-[0_40px_80px_-60px_var(--shadow-tint)] md:p-8">
      <div aria-hidden className="pointer-events-none absolute -top-20 -right-20 size-56 rounded-full bg-[radial-gradient(closest-side,var(--glow-1),transparent)]" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-cta to-orchid" />

      <div className="relative flex items-start justify-between gap-4">
        <span aria-hidden className="font-display text-6xl leading-[0.6] text-violet italic">
          “
        </span>
        {review.project && (
          <span className="rounded-full bg-violet-soft px-3 py-1 text-[0.8rem] font-medium text-violet">{review.project}</span>
        )}
      </div>
      <blockquote className="relative mt-4 flex-1 font-display text-[1.2rem] leading-snug tracking-[-0.01em] text-pretty text-ink">
        {review.quote}
      </blockquote>

      <figcaption className="relative mt-8 flex items-center gap-3 border-t border-line pt-6">
        <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-cta text-sm font-medium text-on-cta">
          {initials}
        </span>
        <span className="leading-tight">
          <span className="block font-medium text-ink">{review.name}</span>
          <span className="mt-0.5 block text-sm text-ink-soft">{review.role}</span>
        </span>
      </figcaption>

      {caseHref && caseLink && (
        <a
          href={caseHref}
          className="relative mt-5 inline-flex w-fit items-center gap-2 rounded-full text-[0.95rem] font-medium text-violet underline decoration-violet/30 underline-offset-4 transition-colors hover:decoration-violet focus-visible:ring-[3px] focus-visible:ring-violet/45 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none"
        >
          {caseLink}
          <span className="sr-only">: {review.name}</span>
          <ButtonArrow />
        </a>
      )}
    </figure>
  );
}
