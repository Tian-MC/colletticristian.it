import type { ReactNode } from "react";
import { Eyebrow } from "@/components/brand";
import { Reveal, WordsReveal } from "@/components/motion";
import { cn } from "@/lib/utils";

export function SectionIntro({
  eyebrow,
  title,
  lead,
  className,
  titleClassName,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  className?: string;
  titleClassName?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("max-w-4xl", className)}>
      <Reveal y={12}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <WordsReveal
        text={title}
        className={cn(
          "mt-6 font-display text-[clamp(2.4rem,5.2vw,4.6rem)] leading-[1] font-[380] tracking-[-0.03em] text-balance text-ink",
          titleClassName,
        )}
      />
      {lead && (
        <Reveal delay={0.15} className="mt-6 max-w-2xl md:mt-8">
          <p className="text-lg leading-relaxed text-pretty text-ink-soft md:text-xl md:leading-relaxed">{lead}</p>
        </Reveal>
      )}
      {children}
    </div>
  );
}
