"use client";

import { AnchorLink } from "@/components/anchor-link";
import { Reveal } from "@/components/motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Dictionary } from "@/content/types";
import { SectionIntro } from "./section-intro";

export function Faq({ t, ids, cta }: { t: Dictionary["faq"]; ids: Dictionary["ids"]; cta: Dictionary["cta"] }) {
  return (
    <section id={ids.faq} tabIndex={-1} className="tone-green relative py-20 md:py-24">
      <div className="container-site grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionIntro
              eyebrow={t.eyebrow}
              title={t.title}
              titleClassName="text-[clamp(2.2rem,4.2vw,3.6rem)] leading-[1.02]"
              lead={
                <>
                  {t.leadBefore}{" "}
                  <AnchorLink
                    href={`#${ids.contact}`}
                    className="text-violet underline decoration-violet/40 underline-offset-4 transition-colors hover:decoration-violet"
                  >
                    {cta.primary}
                  </AnchorLink>
                  {t.leadAfter}
                </>
              }
            />
          </div>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <Accordion type="single" collapsible defaultValue="item-0">
            {t.items.map((faq, i) => (
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
