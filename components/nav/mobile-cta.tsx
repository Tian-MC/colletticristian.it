"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { AnchorLink } from "@/components/anchor-link";
import { ButtonArrow, WhatsAppIcon } from "@/components/brand";
import { EASE } from "@/components/motion";
import { Button } from "@/components/ui/button";

export function MobileCta({
  href,
  watch,
  cta,
  whatsappHref,
  whatsappLabel,
}: {
  href: string;
  watch: string[];
  cta: string;
  whatsappHref: string;
  whatsappLabel: string;
}) {
  const { scrollY } = useScroll();
  const [pastHero, setPastHero] = useState(false);
  const [nearContact, setNearContact] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setPastHero(y > window.innerHeight * 0.85));

  const watched = watch.join("|");
  useEffect(() => {
    const targets = watched
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)));
      setNearContact(visible.size > 0);
    });
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [watched]);

  const show = pastHero && !nearContact;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 110, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 110, opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 flex gap-2 rounded-full border border-line bg-surface/80 p-1.5 shadow-[0_20px_50px_-20px_var(--shadow-tint)] backdrop-blur-xl md:hidden"
        >
          <Button asChild className="h-12 flex-1">
            <AnchorLink href={href}>
              {cta}
              <ButtonArrow />
            </AnchorLink>
          </Button>
          <Button asChild variant="outline" size="icon" className="size-12 text-violet">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label={whatsappLabel}>
              <WhatsAppIcon />
            </a>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
