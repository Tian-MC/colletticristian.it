"use client";

import { Fragment, useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { motion, useReducedMotion, useSpring, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const viewport = { once: true, margin: "0px 0px -12% 0px" } as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  immediate?: boolean;
};

function enterStyle(delay: number, y?: number): CSSProperties {
  const seconds = Math.round(delay * 1000) / 1000;
  return { "--enter-delay": `${seconds}s`, ...(y === undefined ? {} : { "--enter-y": `${y}px` }) } as CSSProperties;
}

export function Reveal({ children, className, delay = 0, y = 28, immediate = false }: RevealProps) {
  if (immediate) {
    return (
      <div className={cn("enter-up", className)} style={enterStyle(delay, y)}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.95, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function enterProps(delay: number, y?: number) {
  return { className: "enter-up", style: enterStyle(delay, y) };
}

type Token = { type: "word"; value: string; italic: boolean } | { type: "break" };

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  let italic = false;
  for (const raw of text.split(/\s+/)) {
    if (!raw) continue;
    if (raw === "|") {
      tokens.push({ type: "break" });
      continue;
    }
    const opens = raw.startsWith("*");
    const closes = raw.endsWith("*") && (raw.length > 1 || !opens);
    if (opens) italic = true;
    tokens.push({ type: "word", value: raw.replace(/\*/g, ""), italic });
    if (closes) italic = false;
  }
  return tokens;
}

const wordVariants: Variants = {
  hidden: { y: "112%", rotate: 4 },
  shown: { y: "0%", rotate: 0, transition: { duration: 1.05, ease: EASE } },
};

type WordsRevealProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  stagger?: number;
  immediate?: boolean;
};

export function WordsReveal({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.06,
  immediate = false,
}: WordsRevealProps) {
  const tokens = tokenize(text);

  if (immediate) {
    let word = 0;
    return (
      <Tag className={className}>
        <span className="block">
          {tokens.map((token, i) =>
            token.type === "break" ? (
              <span key={i} className="hidden md:block" />
            ) : (
              <Fragment key={i}>
                <span className="-mr-[0.08em] -mb-[0.16em] inline-block overflow-hidden pr-[0.08em] pb-[0.16em] align-top">
                  <span className="word-up inline-block origin-bottom-left" style={enterStyle(delay + word++ * stagger)}>
                    {token.italic ? <em>{token.value}</em> : token.value}
                  </span>
                </span>{" "}
              </Fragment>
            ),
          )}
        </span>
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      <motion.span
        className="block"
        initial="hidden"
        whileInView="shown"
        viewport={viewport}
        variants={{ shown: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      >
        {tokens.map((token, i) =>
          token.type === "break" ? (
            <span key={i} className="hidden md:block" />
          ) : (
            <Fragment key={i}>
              <span className="-mr-[0.08em] -mb-[0.16em] inline-block overflow-hidden pr-[0.08em] pb-[0.16em] align-top">
                <motion.span className="inline-block origin-bottom-left" variants={wordVariants}>
                  {token.italic ? <em>{token.value}</em> : token.value}
                </motion.span>
              </span>{" "}
            </Fragment>
          ),
        )}
      </motion.span>
    </Tag>
  );
}

export function Magnetic({
  children,
  className,
  strength = 0.28,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const spring = { stiffness: 220, damping: 17, mass: 0.5 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      style={{ x, y }}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.div>
  );
}
