"use client";

import { motion } from "motion/react";
import { AnchorLink } from "@/components/anchor-link";
import { ButtonArrow } from "@/components/brand";
import { EASE } from "@/components/motion";
import { Rich } from "@/components/rich";
import { site } from "@/content/site";
import type { Dictionary } from "@/content/types";

type FooterProps = {
  t: Dictionary["footer"];
  ids: Dictionary["ids"];
  navigation: Dictionary["navigation"];
  hours: string;
  whatsappHref: string;
  privacyHref: string;
  navLabel: string;
  services: { label: string; href: string }[];
};

export function Footer({ t, ids, navigation, hours, whatsappHref, privacyHref, navLabel, services }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line pt-20 pb-28 md:pb-10">
      <div className="container-site">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-12 lg:gap-x-8">
          <div className="col-span-2 md:col-span-3 lg:col-span-4">
            <p className="max-w-sm font-display text-[1.9rem] leading-tight tracking-[-0.02em] text-balance">
              <Rich text={t.claim} />
            </p>
            <p className="mt-4 max-w-sm text-ink-soft">{t.tagline}</p>
            <ul aria-label={t.profiles} className="mt-6 flex flex-wrap gap-2">
              {site.profiles.map((profile) => (
                <li key={profile.href}>
                  <a
                    href={profile.href}
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line px-3.5 text-sm text-ink-soft transition-colors hover:border-violet/40 hover:text-violet"
                  >
                    {profile.label}
                    <ButtonArrow direction="up-right" />
                    <span className="sr-only">{t.newTab}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label={navLabel} className="lg:col-span-2 lg:col-start-6">
            <p className="text-xs font-medium tracking-[0.18em] text-ink-faint uppercase">{t.navTitle}</p>
            <ul className="mt-4 space-y-1.5">
              {navigation.map((item) => (
                <li key={item.key}>
                  <AnchorLink href={`#${ids[item.key]}`} className="inline-block py-0.5 text-ink-soft transition-colors hover:text-violet">
                    {item.label}
                  </AnchorLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <p className="text-xs font-medium tracking-[0.18em] text-ink-faint uppercase">{t.servicesTitle}</p>
            <ul className="mt-4 space-y-1.5">
              {services.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="inline-block py-0.5 text-ink-soft transition-colors hover:text-violet">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1 lg:col-span-3">
            <p className="text-xs font-medium tracking-[0.18em] text-ink-faint uppercase">{t.contactTitle}</p>
            <ul className="mt-4 space-y-1.5">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-block py-0.5 text-ink-soft transition-colors [overflow-wrap:anywhere] hover:text-violet"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a href={site.phoneHref} className="inline-block py-0.5 text-ink-soft transition-colors hover:text-violet">
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-0.5 text-ink-soft transition-colors hover:text-violet"
                >
                  WhatsApp
                </a>
              </li>
              <li className="text-sm text-ink-faint">{hours}</li>
            </ul>
          </div>
        </div>

        <div className="relative mt-14 md:mt-20">
          <motion.p
            aria-hidden
            initial={{ y: "35%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: EASE }}
            className="font-display text-[clamp(5rem,22vw,19rem)] leading-[0.8] font-[340] tracking-[-0.06em] text-ink select-none [font-variation-settings:'SOFT'_100,'WONK'_1]"
          >
            <span className="italic">Tian</span>
            <span className="text-coral">.</span>
          </motion.p>
          <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="mt-6 h-10 w-full" fill="none" aria-hidden>
            <defs>
              <linearGradient id="footer-thread" x1="0" x2="1200" y1="0" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0" style={{ stopColor: "var(--grape)" }} />
                <stop offset="0.35" style={{ stopColor: "var(--rose)" }} />
                <stop offset="0.65" style={{ stopColor: "var(--coral)" }} />
                <stop offset="1" style={{ stopColor: "var(--teal)" }} />
              </linearGradient>
            </defs>
            <motion.path
              d="M0 40 C 140 40, 170 10, 140 10 C 110 10, 120 44, 200 40 S 700 20, 1200 34"
              stroke="url(#footer-thread)"
              strokeWidth="1.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2.2, ease: EASE, delay: 0.3 }}
            />
          </svg>
        </div>

        <div className="mt-10 flex flex-col gap-4 text-sm text-ink-faint md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.name}
            <span aria-hidden className="mx-2">
              ·
            </span>
            <a href={privacyHref} className="transition-colors hover:text-violet">
              {t.privacy}
            </a>
          </p>
          <p>
            {t.made}
            <span aria-hidden className="mx-2">
              ·
            </span>
            <a href={site.repo} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-violet">
              {t.code}
              <span className="sr-only"> {t.newTab}</span>
            </a>
          </p>
          <AnchorLink href="#" className="group inline-flex items-center gap-2 py-0.5 text-ink-soft transition-colors hover:text-violet">
            {t.backToTop}
            <span aria-hidden className="inline-block transition-transform duration-500 ease-silk group-hover:-translate-y-1">
              ↑
            </span>
          </AnchorLink>
        </div>
      </div>
    </footer>
  );
}
