"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode, type Ref } from "react";
import { AnchorLink, homeOf } from "@/components/anchor-link";
import { ButtonArrow, Logo, WhatsAppIcon } from "@/components/brand";
import { EASE, enterProps } from "@/components/motion";
import { getLenis, useScrollTo } from "@/components/smooth-scroll";
import { Button } from "@/components/ui/button";
import { pageOf } from "@/content/paths";
import { site } from "@/content/site";
import type { Dictionary, ServiceKey } from "@/content/types";
import { useActiveSection } from "@/lib/hooks";
import { serviceTones } from "@/lib/tones";
import { cn } from "@/lib/utils";
import { LanguageSwitch, type LanguageProps } from "./language-switch";
import { ThemeToggle } from "./theme-toggle";

type ServiceLink = { key: ServiceKey; href: string; label: string; hint: string };

type NavProps = {
  home: string;
  ids: Dictionary["ids"];
  navigation: Dictionary["navigation"];
  services: ServiceLink[];
  ui: Dictionary["ui"];
  whatsappHref: string;
  responseNote: string;
  language: LanguageProps;
};

type Group = "explore" | "services";

const headerEnter = enterProps(0.15, -28);

export function SiteNav({ home, ids, navigation, services, ui, whatsappHref, responseNote, language }: NavProps) {
  const observed = useMemo(
    () => [ids.top, ...navigation.map((item) => ids[item.key]), ids.faq],
    [ids, navigation],
  );
  const active = useActiveSection(observed);
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const dismiss = useCallback(() => {
    setOpen(false);
    menuButton.current?.focus();
  }, []);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  const explore = navigation.filter((item) => item.key !== "contact");
  const contactLabel = navigation.find((item) => item.key === "contact")?.label ?? "";
  const page = pageOf(usePathname());
  const exploreActive = explore.some((item) => ids[item.key] === active);
  const servicesActive = services.some((item) => item.key === page);

  const navRef = useRef<HTMLElement>(null);
  const [openGroup, setOpenGroup] = useState<Group | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const openMenu = useCallback((group: Group) => {
    window.clearTimeout(closeTimer.current);
    setOpenGroup(group);
  }, []);
  const closeMenu = useCallback((delay = 0) => {
    window.clearTimeout(closeTimer.current);
    if (delay) closeTimer.current = window.setTimeout(() => setOpenGroup(null), delay);
    else setOpenGroup(null);
  }, []);

  useEffect(() => {
    if (!openGroup) return;
    const onPointer = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) closeMenu();
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && closeMenu();
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [openGroup, closeMenu]);

  const activeGroup = exploreActive ? "explore" : servicesActive ? "services" : null;
  const highlight = hovered ?? openGroup ?? activeGroup;

  return (
    <>
      <header
        style={headerEnter.style}
        className={cn(headerEnter.className, "pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 md:top-5")}
      >
        <nav
          ref={navRef}
          aria-label={ui.mainNav}
          className={cn(
            "pointer-events-auto relative flex w-full items-center gap-1 rounded-full border p-1.5 pl-4 backdrop-blur-xl backdrop-saturate-150 transition-[background-color,border-color,box-shadow] duration-500 md:w-auto lg:pl-5",
            scrolled || open
              ? "border-line bg-surface/75 shadow-[0_18px_50px_-24px_var(--shadow-tint),0_1px_0_rgb(255_255_255/0.4)_inset]"
              : "border-line/60 bg-surface/35",
          )}
        >
          <AnchorLink
            href={`#${ids.top}`}
            aria-label={ui.homeLabel}
            className="mr-2 rounded-full py-1.5 lg:mr-3"
            onClick={() => setOpen(false)}
          >
            <Logo />
          </AnchorLink>

          <ul className="hidden items-center lg:flex" onMouseLeave={() => setHovered(null)}>
            <NavGroup
              id="explore"
              label={ui.navGroups.explore}
              open={openGroup === "explore"}
              active={exploreActive}
              highlighted={highlight === "explore"}
              onOpen={openMenu}
              onClose={closeMenu}
              onHover={() => setHovered("explore")}
            >
              {explore.map((item) => {
                const id = ids[item.key];
                const current = active === id;
                return (
                  <li key={id}>
                    <AnchorLink
                      href={`#${id}`}
                      aria-current={current ? "location" : undefined}
                      onClick={() => closeMenu()}
                      className={cn(
                        "flex items-center justify-between gap-6 rounded-xl px-3.5 py-2.5 text-[0.95rem] transition-colors duration-300 hover:bg-violet-soft/70 hover:text-ink focus-visible:bg-violet-soft/70",
                        current ? "text-ink" : "text-ink-soft",
                      )}
                    >
                      {item.label}
                      {current && <span aria-hidden className="size-1.5 rounded-full bg-violet" />}
                    </AnchorLink>
                  </li>
                );
              })}
            </NavGroup>

            <NavGroup
              id="services"
              label={ui.navGroups.services}
              open={openGroup === "services"}
              active={servicesActive}
              highlighted={highlight === "services"}
              onOpen={openMenu}
              onClose={closeMenu}
              onHover={() => setHovered("services")}
            >
              {services.map((item) => (
                <li key={item.key} className={serviceTones[item.key]}>
                  <a
                    href={item.href}
                    aria-current={page === item.key ? "page" : undefined}
                    onClick={() => closeMenu()}
                    className="flex items-start gap-3 rounded-xl px-3.5 py-2.5 transition-colors duration-300 hover:bg-violet-soft/70 focus-visible:bg-violet-soft/70"
                  >
                    <span aria-hidden className="mt-[0.45rem] size-2 shrink-0 rounded-full bg-violet" />
                    <span>
                      <span className={cn("block text-[0.95rem] font-medium", page === item.key ? "text-violet" : "text-ink")}>
                        {item.label}
                      </span>
                      <span className="block text-sm text-ink-faint">{item.hint}</span>
                    </span>
                  </a>
                </li>
              ))}
            </NavGroup>
          </ul>

          <div className="ml-auto flex items-center gap-1 md:ml-2 lg:ml-6 lg:gap-1.5">
            <LanguageSwitch {...language} className="max-sm:hidden" />
            <ThemeToggle label={ui.theme.label} toDark={ui.theme.toDark} toLight={ui.theme.toLight} />
            <Button asChild size="sm" className="hidden h-10 px-4 sm:inline-flex lg:px-5">
              <AnchorLink href={`#${ids.contact}`}>
                {contactLabel}
                <ButtonArrow />
              </AnchorLink>
            </Button>
            <MenuButton
              ref={menuButton}
              open={open}
              onClick={() => setOpen((value) => !value)}
              openLabel={ui.menuOpen}
              closeLabel={ui.menuClose}
              menuText={ui.menuText}
              closeText={ui.closeText}
            />
          </div>

          <motion.span
            aria-hidden
            style={{ scaleX: progress }}
            className="pointer-events-none absolute right-8 -bottom-px left-8 h-px origin-left bg-linear-to-r from-transparent via-violet to-orchid"
          />
        </nav>
      </header>

      <MobileMenu
        open={open}
        onClose={close}
        onDismiss={dismiss}
        active={active}
        home={home}
        ids={ids}
        navigation={navigation}
        services={services}
        ui={ui}
        whatsappHref={whatsappHref}
        responseNote={responseNote}
        language={language}
      />
    </>
  );
}

function NavGroup({
  id,
  label,
  open,
  active,
  highlighted,
  onOpen,
  onClose,
  onHover,
  children,
}: {
  id: Group;
  label: string;
  open: boolean;
  active: boolean;
  highlighted: boolean;
  onOpen: (group: Group) => void;
  onClose: (delay?: number) => void;
  onHover: () => void;
  children: ReactNode;
}) {
  const button = useRef<HTMLButtonElement>(null);
  return (
    <li
      className="relative"
      onPointerEnter={(event) => event.pointerType === "mouse" && onOpen(id)}
      onPointerLeave={(event) => event.pointerType === "mouse" && onClose(160)}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          onClose();
          button.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (open && !event.currentTarget.contains(event.relatedTarget as Node)) onClose();
      }}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={`menu-${id}`}
        onClick={() => (open ? onClose() : onOpen(id))}
        onMouseEnter={onHover}
        onFocus={onHover}
        className={cn(
          "relative flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.94rem] whitespace-nowrap transition-colors duration-300",
          highlighted || active || open ? "text-ink" : "text-ink-soft",
        )}
      >
        {highlighted && (
          <motion.span
            layoutId="nav-highlight"
            className="absolute inset-0 rounded-full bg-violet-soft"
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          />
        )}
        <span className="relative">{label}</span>
        <svg viewBox="0 0 16 16" aria-hidden className={cn("relative size-3.5 transition-transform duration-300 ease-silk", open && "rotate-180")} fill="none">
          <path d="M4 6.5 8 10.5 12 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {active && !highlighted && <span aria-hidden className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-violet" />}
      </button>

      <AnimatePresence>
        {open && (
          <div className="absolute top-full left-1/2 z-10 -translate-x-1/2 pt-3">
            <motion.div
              id={`menu-${id}`}
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.15 } }}
              transition={{ duration: 0.3, ease: EASE }}
              className="w-max min-w-[15rem] origin-top rounded-2xl border border-line bg-surface/95 p-2 shadow-[0_24px_60px_-24px_var(--shadow-tint)] backdrop-blur-xl"
            >
              <ul>{children}</ul>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </li>
  );
}

function MenuButton({
  open,
  onClick,
  ref,
  openLabel,
  closeLabel,
  menuText,
  closeText,
}: {
  open: boolean;
  onClick: () => void;
  ref: Ref<HTMLButtonElement>;
  openLabel: string;
  closeLabel: string;
  menuText: string;
  closeText: string;
}) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls="menu-mobile"
      aria-label={open ? closeLabel : openLabel}
      className="relative flex h-10 items-center gap-2.5 rounded-full bg-ink pr-4 pl-4 text-sm font-medium text-paper lg:hidden"
    >
      <span className="relative block h-2.5 w-4" aria-hidden>
        <span
          className={cn(
            "absolute left-0 h-[1.5px] w-full rounded-full bg-current transition-[top,rotate] duration-500 ease-silk",
            open ? "top-[4.25px] rotate-45" : "top-0",
          )}
        />
        <span
          className={cn(
            "absolute left-0 h-[1.5px] rounded-full bg-current transition-[top,rotate,width] duration-500 ease-silk",
            open ? "top-[4.25px] w-full -rotate-45" : "top-[8.5px] w-2/3",
          )}
        />
      </span>
      <span className="relative inline-grid overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={open ? "close" : "menu"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {open ? closeText : menuText}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}

function MobileMenu({
  open,
  onClose,
  onDismiss,
  active,
  home,
  ids,
  navigation,
  services,
  ui,
  whatsappHref,
  responseNote,
  language,
}: NavProps & {
  open: boolean;
  onClose: () => void;
  onDismiss: () => void;
  active: string | null;
}) {
  const scrollTo = useScrollTo();
  const pathname = usePathname();
  const onHome = pathname === homeOf(pathname);
  const page = pageOf(pathname);
  const explore = navigation.filter((item) => item.key !== "contact");
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const behind = document.querySelectorAll<HTMLElement>("body > :not(header):not(#menu-mobile)");
    behind.forEach((el) => (el.inert = true));
    const timer = window.setTimeout(() => firstLink.current?.focus({ preventScroll: true }), 350);
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onDismiss();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      root.style.overflow = previous;
      behind.forEach((el) => (el.inert = false));
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onDismiss]);

  function go(hash: string) {
    onClose();
    requestAnimationFrame(() => requestAnimationFrame(() => scrollTo(hash)));
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="menu-mobile"
          role="dialog"
          aria-modal="true"
          aria-label={ui.menuLabel}
          initial={{ clipPath: "circle(0vmax at calc(100% - 64px) 39px)" }}
          animate={{ clipPath: "circle(150vmax at calc(100% - 64px) 39px)" }}
          exit={{ clipPath: "circle(0vmax at calc(100% - 64px) 39px)" }}
          transition={{ duration: 0.75, ease: [0.7, 0, 0.2, 1] }}
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-paper px-6 pt-28 pb-8 lg:hidden"
        >
          <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="absolute -top-1/4 -right-1/3 size-[120vw] rounded-full bg-[radial-gradient(closest-side,var(--glow-1),transparent)]" />
            <div className="absolute -bottom-1/3 -left-1/3 size-[110vw] rounded-full bg-[radial-gradient(closest-side,var(--glow-2),transparent)]" />
          </div>

          <nav aria-label={ui.mobileNav} className="relative space-y-8">
            <div>
              <MobileHeading text={ui.navGroups.explore} delay={0.14} />
              <ul className="mt-2 flex flex-col">
                {explore.map((item, i) => {
                  const id = ids[item.key];
                  const isActive = active === id;
                  return (
                    <MobileItem key={id} delay={0.18 + i * 0.05}>
                      <a
                        ref={i === 0 ? firstLink : undefined}
                        href={onHome ? `#${id}` : `${home}#${id}`}
                        onClick={(event) => {
                          if (!onHome) return;
                          event.preventDefault();
                          go(`#${id}`);
                        }}
                        aria-current={isActive ? "location" : undefined}
                        className="flex items-baseline gap-4 py-3"
                      >
                        <span aria-hidden data-n={`0${i + 1}`} className="w-6 text-xs font-medium text-ink-faint tabular-nums before:content-[attr(data-n)]" />
                        <span
                          className={cn(
                            "font-display text-[2.2rem] leading-none tracking-[-0.03em]",
                            isActive && "text-violet italic [font-variation-settings:'SOFT'_100,'WONK'_1]",
                          )}
                        >
                          {item.label}
                        </span>
                      </a>
                    </MobileItem>
                  );
                })}
              </ul>
            </div>

            <div>
              <MobileHeading text={ui.navGroups.services} delay={0.34} />
              <ul className="mt-2 flex flex-col">
                {services.map((item, i) => {
                  const current = page === item.key;
                  return (
                    <MobileItem key={item.key} delay={0.38 + i * 0.05} className={serviceTones[item.key]}>
                      <a href={item.href} aria-current={current ? "page" : undefined} className="flex items-center gap-4 py-3">
                        <span aria-hidden className="ml-1 size-2.5 shrink-0 rounded-full bg-violet" />
                        <span className="min-w-0">
                          <span
                            className={cn(
                              "block font-display text-[1.75rem] leading-tight tracking-[-0.025em]",
                              current && "text-violet italic [font-variation-settings:'SOFT'_100,'WONK'_1]",
                            )}
                          >
                            {item.label}
                          </span>
                          <span className="block text-sm text-ink-faint">{item.hint}</span>
                        </span>
                      </a>
                    </MobileItem>
                  );
                })}
              </ul>
            </div>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
            className="relative mt-auto pt-10"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-ink-soft">{ui.menuPrompt}</p>
              <LanguageSwitch {...language} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button asChild size="lg" className="col-span-2">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon />
                  {ui.whatsappLabel}
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-4">
                <a href={site.phoneHref}>{ui.call}</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-4">
                <a href={`mailto:${site.email}`}>{ui.email}</a>
              </Button>
            </div>
            <p className="mt-5 text-xs text-ink-faint">{responseNote}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MobileHeading({ text, delay }: { text: string; delay: number }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ delay, duration: 0.7, ease: EASE }}
      className="text-xs font-medium tracking-[0.18em] text-ink-faint uppercase"
    >
      {text}
    </motion.p>
  );
}

function MobileItem({ delay, className, children }: { delay: number; className?: string; children: ReactNode }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
      transition={{ delay, duration: 0.8, ease: EASE }}
      className={cn("border-b border-line/70", className)}
    >
      {children}
    </motion.li>
  );
}
