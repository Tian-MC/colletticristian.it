"use client";

import { motion, type Transition } from "motion/react";
import type { ServiceArtKey } from "@/content/types";

const draw = (i: number, duration = 1.1) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { pathLength: { duration, delay: 0.08 * i, ease: [0.65, 0, 0.35, 1] }, opacity: { duration: 0.2, delay: 0.08 * i } } as Transition,
});

const pop = (i: number) => ({
  initial: { opacity: 0, scale: 0.6 },
  animate: { opacity: 1, scale: 1 },
  transition: { delay: 0.35 + 0.07 * i, type: "spring", stiffness: 260, damping: 18 } as Transition,
  style: { transformBox: "fill-box", transformOrigin: "center" } as const,
});

const line = { stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" } as const;

function wavePath(phase: number) {
  const points = Array.from({ length: 29 }, (_, i) => {
    const x = 16 + i * 10.5;
    return { x, y: 130 + Math.sin((x - 16) * ((Math.PI * 2) / 150) + phase) * 46 };
  });
  let d = `M${points[0].x} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    d += ` C${(p1.x + (p2.x - p0.x) / 6).toFixed(1)} ${(p1.y + (p2.y - p0.y) / 6).toFixed(1)} ${(p2.x - (p3.x - p1.x) / 6).toFixed(1)} ${(p2.y - (p3.y - p1.y) / 6).toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export function ServiceArt({ id }: { id: ServiceArtKey }) {
  return (
    <svg viewBox="0 0 320 260" className="h-full w-full text-violet" aria-hidden>
      {id === "presence" && <Presence />}
      {id === "time" && <Time />}
      {id === "tools" && <Tools />}
      {id === "advice" && <Advice />}
      {id === "support" && <Support />}
    </svg>
  );
}

function Presence() {
  return (
    <g>
      <motion.rect x="36" y="34" width="248" height="184" rx="16" className="fill-surface/70" {...line} {...draw(0, 1.4)} />
      <motion.line x1="36" y1="60" x2="284" y2="60" {...line} {...draw(1)} />
      {[52, 64, 76].map((cx, i) => (
        <motion.circle key={cx} cx={cx} cy="47" r="3" className="fill-lilac" {...pop(i)} />
      ))}
      <motion.path d="M58 200 V132 A38 38 0 0 1 134 132 V200 Z" className="fill-violet-soft" {...line} {...draw(2, 1.2)} />
      <motion.circle cx="100" cy="142" r="10" className="fill-orchid/60" {...pop(3)} />
      <motion.path d="M58 186 C 78 166, 104 170, 134 180" {...line} {...draw(4)} />
      <motion.line x1="156" y1="104" x2="258" y2="104" {...line} strokeWidth={7} {...draw(5)} />
      <motion.line x1="156" y1="126" x2="238" y2="126" {...line} strokeWidth={2.4} className="text-lilac" {...draw(6)} />
      <motion.line x1="156" y1="140" x2="250" y2="140" {...line} strokeWidth={2.4} className="text-lilac" {...draw(7)} />
      <motion.line x1="156" y1="154" x2="218" y2="154" {...line} strokeWidth={2.4} className="text-lilac" {...draw(8)} />
      <motion.rect x="156" y="172" width="66" height="24" rx="12" className="fill-cta" {...pop(6)} />
      <motion.path d="M214 188 l0 24 l6.5 -6.5 l7.5 12 l4.5 -2.5 l-7.5 -12 l9.5 -0.5 Z" className="fill-surface" {...line} {...pop(8)} />
      <motion.path d="M270 14 L272.6 24.4 L283 27 L272.6 29.6 L270 40 L267.4 29.6 L257 27 L267.4 24.4 Z" className="fill-orchid" {...pop(9)} />
    </g>
  );
}

function Time() {
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6;
    return { x1: 120 + Math.cos(a) * 60, y1: 130 + Math.sin(a) * 60, x2: 120 + Math.cos(a) * 66, y2: 130 + Math.sin(a) * 66 };
  });
  return (
    <g>
      <motion.circle cx="120" cy="130" r="74" className="fill-surface/70" {...line} {...draw(0, 1.4)} />
      {ticks.map((t, i) => (
        <motion.line key={i} {...t} {...line} className="text-lilac" {...draw(1 + i * 0.3, 0.4)} />
      ))}
      <motion.line x1="120" y1="130" x2="120" y2="84" {...line} strokeWidth={3} {...draw(4)} />
      <motion.line x1="120" y1="130" x2="152" y2="148" {...line} strokeWidth={3} {...draw(5)} />
      <motion.circle cx="120" cy="130" r="5" className="fill-violet" {...pop(1)} />
      <motion.path d="M199.7 84 A92 92 0 1 1 136 39.4" {...line} className="text-orchid" {...draw(3, 1.6)} />
      <motion.path d="M127 31 L136.5 39.5 L126 47" {...line} className="text-orchid" {...draw(9, 0.4)} />
      <motion.circle cx="252" cy="192" r="26" className="fill-cta" {...pop(6)} />
      <motion.path d="M240.5 192.5 l8 8 l14 -15" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" {...draw(10, 0.5)} />
    </g>
  );
}

function Tools() {
  const bars = [
    { x: 108, h: 46 },
    { x: 132, h: 72 },
    { x: 156, h: 58 },
    { x: 180, h: 94 },
  ];
  return (
    <g>
      <motion.rect x="28" y="36" width="264" height="190" rx="16" className="fill-surface/70" {...line} {...draw(0, 1.4)} />
      <motion.line x1="88" y1="36" x2="88" y2="226" {...line} {...draw(1)} />
      {[64, 80, 96].map((y, i) => (
        <motion.line key={y} x1="44" y1={y} x2={i === 1 ? 66 : 74} y2={y} {...line} strokeWidth={2.4} className="text-lilac" {...draw(2 + i * 0.5, 0.5)} />
      ))}
      <motion.rect x="40" y="110" width="38" height="14" rx="7" className="fill-violet-soft" {...pop(1)} />
      <motion.line x1="106" y1="62" x2="176" y2="62" {...line} strokeWidth={7} {...draw(3)} />
      {bars.map((bar, i) => (
        <motion.rect
          key={bar.x}
          x={bar.x}
          y={204 - bar.h}
          width="16"
          height={bar.h}
          rx="5"
          className={i === 3 ? "fill-cta" : "fill-lilac/70"}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.4 + i * 0.08, type: "spring", stiffness: 180, damping: 18 }}
          style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
        />
      ))}
      <motion.path d="M210 186 C 224 170, 234 176, 246 154 S 266 126, 274 108" {...line} strokeWidth={2.4} className="text-orchid" {...draw(6, 1)} />
      <motion.circle cx="274" cy="108" r="4.5" className="fill-orchid" {...pop(7)} />
      <motion.rect x="210" y="70" width="44" height="22" rx="11" className="fill-cta" {...pop(4)} />
      <motion.circle
        cy="81"
        r="7.5"
        fill="white"
        initial={{ cx: 221 }}
        animate={{ cx: 243 }}
        transition={{ delay: 0.9, type: "spring", stiffness: 300, damping: 20 }}
      />
    </g>
  );
}

function Advice() {
  return (
    <g>
      <motion.path d="M160 222 C 160 196, 160 176, 160 154" {...line} strokeWidth={2.4} {...draw(0)} />
      <motion.path d="M160 154 C 160 122, 112 112, 84 74" {...line} className="text-ink-faint" strokeDasharray="3 7" {...draw(2, 1)} />
      <motion.path d="M160 154 C 154 124, 150 96, 156 60" {...line} className="text-ink-faint" strokeDasharray="3 7" {...draw(3, 1)} />
      <motion.path d="M160 154 C 162 120, 208 110, 236 70" {...line} strokeWidth={2.6} {...draw(4, 1.2)} />
      <motion.circle cx="84" cy="66" r="13" className="fill-surface/70 text-ink-faint" {...line} {...pop(5)} />
      <motion.circle cx="156" cy="50" r="13" className="fill-surface/70 text-ink-faint" {...line} {...pop(6)} />
      <motion.text x="84" y="71.5" textAnchor="middle" className="fill-ink-faint font-display text-[15px]" {...pop(5)}>
        ?
      </motion.text>
      <motion.text x="156" y="55.5" textAnchor="middle" className="fill-ink-faint font-display text-[15px]" {...pop(6)}>
        ?
      </motion.text>
      <motion.line x1="236" y1="70" x2="236" y2="28" {...line} strokeWidth={2.4} {...draw(8, 0.5)} />
      <motion.path d="M236 28 L268 37 L236 48 Z" className="fill-orchid" {...pop(9)} />
      <motion.circle cx="160" cy="226" r="16" className="fill-violet/15" {...pop(0)} />
      <motion.circle cx="160" cy="226" r="7" className="fill-violet" {...pop(1)} />
    </g>
  );
}

function Support() {
  const nodes = [16 + 75, 16 + 150, 16 + 225];
  return (
    <g>
      <motion.path d={wavePath(0)} {...line} strokeWidth={2.6} {...draw(0, 1.6)} />
      <motion.path d={wavePath(Math.PI)} {...line} strokeWidth={2.6} className="text-orchid" {...draw(2, 1.6)} />
      {nodes.map((x, i) => (
        <motion.circle key={x} cx={x} cy="130" r="7" className="fill-surface" {...line} {...pop(4 + i * 2)} />
      ))}
      <motion.circle cx="16" cy="130" r="5" className="fill-violet" {...pop(0)} />
      <motion.circle cx="16" cy="130" r="12" className="fill-violet/15" {...pop(0)} />
    </g>
  );
}
