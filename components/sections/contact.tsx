"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ButtonArrow, WhatsAppIcon } from "@/components/brand";
import { EASE, Reveal } from "@/components/motion";
import { Rich } from "@/components/rich";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/content/site";
import type { Dictionary } from "@/content/types";
import { cn } from "@/lib/utils";
import { SectionIntro } from "./section-intro";

type ContactProps = {
  t: Dictionary["contact"];
  id: string;
  info: Dictionary["contactInfo"];
  whatsappHref: string;
  privacyHref: string;
  locale: string;
};

export function Contact({ t, id, info, whatsappHref, privacyHref, locale }: ContactProps) {
  return (
    <section id={id} tabIndex={-1} className="relative py-20 md:py-24">
      <div className="container-site">
        <SectionIntro
          eyebrow={t.eyebrow}
          title={t.title}
        />

        <div className="mt-16 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <ul className="border-t border-line">
              <ContactRow
                href={whatsappHref}
                external
                icon={<WhatsAppIcon className="size-[1.15rem]" />}
                label="WhatsApp"
                value={site.whatsappDisplay}
                hint={t.whatsappHint}
                delay={0}
              />
              <ContactRow
                href={`mailto:${site.email}`}
                icon={<MailIcon />}
                label="Email"
                value={site.email}
                hint={t.emailHint}
                delay={0.08}
                copy={site.email}
                copyLabels={{ copy: t.copy, copied: t.copied, copyLabel: t.copyLabel, copiedLabel: t.copiedLabel }}
              />
              <ContactRow
                href={site.phoneHref}
                icon={<PhoneIcon />}
                label={t.phoneLabel}
                value={site.phoneDisplay}
                hint={info.hours}
                delay={0.16}
              />
            </ul>

            <Reveal delay={0.2} className="mt-10 flex items-start gap-4 rounded-2xl border border-line bg-surface/60 p-5 backdrop-blur-sm">
              <span className="relative mt-1 flex size-2.5 shrink-0">
                <span className="absolute inset-0 rounded-full bg-violet [animation:soft-pulse_2.4s_ease-out_infinite]" />
                <span className="relative size-2.5 rounded-full bg-violet" />
              </span>
              <p className="text-[0.95rem] leading-relaxed text-ink-soft">
                <span className="font-medium text-ink">{info.responseNote}</span> {t.weekendNote}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-7">
            <ContactForm t={t.form} privacyHref={privacyHref} locale={locale} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  href,
  icon,
  label,
  value,
  hint,
  delay,
  external,
  copy,
  copyLabels,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
  delay: number;
  external?: boolean;
  copy?: string;
  copyLabels?: { copy: string; copied: string; copyLabel: string; copiedLabel: string };
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    if (!copy) return;
    try {
      await navigator.clipboard.writeText(copy);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard non disponibile */
    }
  }

  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className="group relative border-b border-line"
    >
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="relative isolate flex items-center gap-5 overflow-hidden rounded-2xl py-6 pr-14 pl-1 md:py-7 md:pl-3"
      >
        <span
          aria-hidden
          className="absolute inset-0 -z-10 origin-left scale-x-0 rounded-2xl bg-violet-soft/60 transition-transform duration-700 ease-silk group-hover:scale-x-100 group-focus-within:scale-x-100"
        />
        <span className="grid size-12 shrink-0 place-items-center rounded-full border border-line bg-surface text-violet transition-[background-color,color,border-color] duration-500 group-hover:border-transparent group-hover:bg-cta group-hover:text-on-cta">
          {icon}
        </span>
        <span className="flex min-w-0 flex-1 flex-col sm:grid sm:grid-cols-[auto_minmax(0,1fr)] sm:items-baseline sm:gap-x-3">
          <span className="font-display text-2xl tracking-[-0.01em] text-ink">{label}</span>
          <span className="mt-0.5 block min-w-0 truncate text-ink-soft sm:col-span-2 sm:row-start-2">{value}</span>
          <span className="mt-0.5 block text-sm text-ink-faint sm:col-start-2 sm:row-start-1 sm:mt-0">{hint}</span>
        </span>
        <ButtonArrow direction="up-right" className="absolute right-4 size-5 text-violet [&_svg]:size-5" />
      </a>
      {copy && (
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? copyLabels?.copiedLabel : copyLabels?.copyLabel}
          className="absolute top-1/2 right-12 hidden -translate-y-1/2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-ink-soft opacity-0 transition-[opacity,color,border-color] duration-300 group-hover:opacity-100 hover:border-violet/40 hover:text-ink focus-visible:opacity-100 md:block"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? "ok" : "copy"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="block"
            >
              {copied ? copyLabels?.copied : copyLabels?.copy}
            </motion.span>
          </AnimatePresence>
        </button>
      )}
    </motion.li>
  );
}

type Status = "idle" | "sending" | "sent" | "error" | "limited";

function ContactForm({
  t,
  privacyHref,
  locale,
}: {
  t: Dictionary["contact"]["form"];
  privacyHref: string;
  locale: string;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<{ name?: string; contact?: string }>({});
  const backToForm = useRef(false);
  const formRef = useCallback((form: HTMLFormElement | null) => {
    if (!form || !backToForm.current) return;
    backToForm.current = false;
    form.querySelector<HTMLInputElement>("#nome")?.focus();
  }, []);
  const focusOnMount = useCallback((el: HTMLElement | null) => el?.focus(), []);

  function toggleNeed(need: string) {
    setSelected((current) => (current.includes(need) ? current.filter((n) => n !== need) : [...current, need]));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trap = new FormData(event.currentTarget).get("sito");
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = t.nameError;
    if (!contact.trim()) nextErrors.contact = t.contactError;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => document.getElementById(nextErrors.name ? "nome" : "contatto")?.focus());
      return;
    }

    const summary = [
      `${t.mailLabels.name}: ${name}`,
      `${t.mailLabels.contact}: ${contact}`,
      selected.length ? `${t.mailLabels.needs}: ${selected.join(", ")}` : null,
      message ? `\n${message}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    setStatus("sending");
    try {
      if (site.formEndpoint) {
        const response = await fetch(site.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            nome: name,
            contatto: contact,
            esigenze: selected.join(", "),
            messaggio: message,
            sito: trap,
            lingua: locale,
          }),
        });
        if (response.status === 429) return setStatus("limited");
        if (!response.ok) throw new Error("invio non riuscito");
      } else {
        const subject = encodeURIComponent(`${t.mailSubject} ${name}`);
        window.location.href = `mailto:${site.email}?subject=${subject}&body=${encodeURIComponent(summary)}`;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[2.25rem] border border-line bg-surface/75 p-6 shadow-[0_50px_100px_-60px_var(--shadow-tint)] backdrop-blur-md md:p-10">
      <div aria-hidden className="pointer-events-none absolute -top-32 -right-32 size-80 rounded-full bg-[radial-gradient(closest-side,var(--glow-2),transparent)]" />

      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative flex min-h-[30rem] flex-col items-center justify-center text-center focus:outline-none"
            role="status"
            tabIndex={-1}
            ref={focusOnMount}
          >
            <svg viewBox="0 0 80 80" className="size-20 text-violet" fill="none" aria-hidden>
              <motion.circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, ease: EASE }}
              />
              <motion.path
                d="M25 41 L35 51 L56 29"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
              />
            </svg>
            <p className="mt-8 font-display text-4xl tracking-[-0.02em]">
              {t.sentBefore} <em className="accent">{name.split(" ")[0]}</em>
              {t.sentAfter}
            </p>
            <p className="mt-4 max-w-sm leading-relaxed text-ink-soft">
              {site.formEndpoint ? t.sentText : t.sentTextMail}
            </p>
            <Button
              variant="ghost"
              className="mt-8"
              onClick={() => {
                backToForm.current = true;
                setStatus("idle");
              }}
            >
              {t.another}
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="relative"
            ref={formRef}
          >
            <h3 className="font-display text-[1.9rem] leading-tight tracking-[-0.02em]">{t.title}</h3>
            <p className="mt-2 text-ink-soft">{t.subtitle}</p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <Field id="nome" label={t.nameLabel} error={errors.name}>
                <Input
                  id="nome"
                  name="nome"
                  autoComplete="name"
                  placeholder={t.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "nome-errore" : undefined}
                />
              </Field>
              <Field id="contatto" label={t.contactLabel} error={errors.contact}>
                <Input
                  id="contatto"
                  name="contatto"
                  autoComplete="email"
                  placeholder={t.contactPlaceholder}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  aria-invalid={Boolean(errors.contact)}
                  aria-describedby={errors.contact ? "contatto-errore" : undefined}
                />
              </Field>
            </div>

            <fieldset className="mt-7">
              <legend className="text-sm font-medium text-ink">{t.needsLegend}</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {t.needs.map((need) => {
                  const on = selected.includes(need);
                  return (
                    <button
                      key={need}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleNeed(need)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-[background-color,border-color,color] duration-300",
                        on
                          ? "border-transparent bg-cta text-on-cta"
                          : "border-line bg-paper/60 text-ink-soft hover:border-violet/40 hover:text-ink",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "grid size-3.5 place-items-center overflow-hidden transition-[width,opacity] duration-300",
                          on ? "w-3.5 opacity-100" : "w-0 opacity-0",
                        )}
                      >
                        <svg viewBox="0 0 16 16" className="size-3.5" fill="none">
                          <path d="M3.5 8.5 6.5 11.5 12.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {need}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-7">
              <Label htmlFor="messaggio">
                {t.messageLabel} <span className="font-normal text-ink-faint">{t.optional}</span>
              </Label>
              <Textarea
                id="messaggio"
                name="messaggio"
                className="mt-2.5"
                placeholder={t.messagePlaceholder}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
              <label htmlFor="sito">{t.honeypot}</label>
              <input id="sito" name="sito" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xs text-xs leading-relaxed text-ink-faint">
                {t.privacyBefore}{" "}
                <a
                  href={privacyHref}
                  className="text-ink-soft underline decoration-ink-faint/50 underline-offset-2 transition-colors hover:text-violet hover:decoration-violet"
                >
                  {t.privacyLink}
                </a>
                {t.privacyAfter}
              </p>
              <Button type="submit" size="lg" disabled={status === "sending"} className="w-full sm:w-auto">
                {status === "sending" ? t.sending : t.submit}
                <ButtonArrow />
              </Button>
            </div>

            {status === "error" && (
              <p role="alert" className="mt-4 text-sm text-destructive">
                <Rich text={t.error} link="underline underline-offset-2" />
              </p>
            )}
            {status === "limited" && (
              <p role="alert" className="mt-4 text-sm text-destructive">
                <Rich text={t.limited} link="underline underline-offset-2" />
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-2.5">{children}</div>
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-errore`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden pt-2 text-sm text-destructive"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[1.15rem]" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[1.15rem]" fill="none" aria-hidden>
      <path
        d="M6.6 3.5h2.2l1.5 4-2 1.3a11 11 0 0 0 6.9 6.9l1.3-2 4 1.5v2.2a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
