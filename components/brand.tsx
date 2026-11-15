"use client";

import { motion } from "motion/react";
import type { ReactNode, SVGProps } from "react";
import { cn } from "@/lib/utils";

const KNOT = "M2 15 C 8 15, 11.5 4, 8 4 C 4.5 4, 5.5 15, 13 15 L 26 15";
const UNTIED = "M2 15 C 8 15, 9 15, 10 15 C 11 15, 12 15, 14 15 L 26 15";

export function KnotGlyph({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 28 18" fill="none" aria-hidden className={cn("h-3.5 w-6", className)} {...props}>
      <path d={KNOT} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <motion.span initial="tied" whileHover="untied" className={cn("group inline-flex items-center gap-1.5", className)}>
      <svg viewBox="0 0 28 18" fill="none" aria-hidden className="h-[18px] w-7 text-violet">
        <motion.path
          variants={{ tied: { d: KNOT }, untied: { d: UNTIED } }}
          transition={{ type: "spring", stiffness: 160, damping: 14 }}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-display text-[1.4rem] leading-none font-medium tracking-[-0.02em] italic [font-variation-settings:'SOFT'_100,'WONK'_1]">
        Tian
      </span>
    </motion.span>
  );
}

export function Eyebrow({ children, className, as: Tag = "p" }: { children: ReactNode; className?: string; as?: "p" | "h2" }) {
  return (
    <Tag className={cn("inline-flex items-center gap-2.5 text-sm font-medium tracking-wide text-violet", className)}>
      <KnotGlyph />
      {children}
    </Tag>
  );
}

export function ButtonArrow({ className, direction = "right" }: { className?: string; direction?: "right" | "down" | "up-right" }) {
  const rotate = direction === "down" ? "rotate-90" : direction === "up-right" ? "-rotate-45" : "";
  return (
    <span aria-hidden className={cn("relative inline-flex size-4 overflow-hidden", rotate, className)}>
      <ArrowGlyph className="absolute inset-0 transition-transform duration-500 ease-silk group-hover/button:translate-x-[130%] group-hover:translate-x-[130%]" />
      <ArrowGlyph className="absolute inset-0 -translate-x-[130%] transition-transform duration-500 ease-silk group-hover/button:translate-x-0 group-hover:translate-x-0" />
    </span>
  );
}

function ArrowGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={cn("size-4", className)}>
      <path d="M2.5 8h10.5M9 3.75 13.25 8 9 12.25" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-5", className)} fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}
