"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EASE } from "@/components/motion";
import { cn } from "@/lib/utils";

type Point = { x: number; y: number };

type Layout = {
  width: number;
  height: number;
  smooth: Point[];
  tangled: Point[];
  knot: { x: number; y: number; r: number };
  noteBefore: Point;
  noteAfter: Point;
  mobile: boolean;
};

const COUNT = 22;

function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

type Segment = [Point, Point, Point, Point];

function toSegments(points: Point[]): Segment[] {
  const segments: Segment[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    segments.push([
      p1,
      { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 },
      { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 },
      p2,
    ]);
  }
  return segments;
}

function toPath(segments: Segment[]) {
  const f = (p: Point) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  let d = `M${f(segments[0][0])}`;
  for (const [, c1, c2, p2] of segments) d += ` C${f(c1)} ${f(c2)} ${f(p2)}`;
  return d;
}

const BEAD_STEPS = 8;
const beadX = new Float64Array((COUNT - 1) * BEAD_STEPS + 1);
const beadY = new Float64Array(beadX.length);
const beadLength = new Float64Array(beadX.length);

function pointAlong(segments: Segment[], fraction: number): Point {
  let n = 0;
  for (const [p1, c1, c2, p2] of segments) {
    for (let s = n === 0 ? 0 : 1; s <= BEAD_STEPS; s++) {
      const t = s / BEAD_STEPS;
      const u = 1 - t;
      const a = u * u * u;
      const b = 3 * u * u * t;
      const c = 3 * u * t * t;
      const e = t * t * t;
      beadX[n] = a * p1.x + b * c1.x + c * c2.x + e * p2.x;
      beadY[n] = a * p1.y + b * c1.y + c * c2.y + e * p2.y;
      beadLength[n] = n === 0 ? 0 : beadLength[n - 1] + Math.hypot(beadX[n] - beadX[n - 1], beadY[n] - beadY[n - 1]);
      n++;
    }
  }
  const target = beadLength[n - 1] * fraction;
  let i = 1;
  while (i < n - 1 && beadLength[i] < target) i++;
  const span = beadLength[i] - beadLength[i - 1] || 1;
  const k = (target - beadLength[i - 1]) / span;
  return { x: lerp(beadX[i - 1], beadX[i], k), y: lerp(beadY[i - 1], beadY[i], k) };
}

function buildLayout(width: number, height: number): Layout {
  const mobile = width < 768;
  const random = seeded(11);
  const x0 = -40;
  const x1 = width + 40;

  const yStart = mobile ? height - 40 : height * 0.94;
  const yEnd = mobile ? height - 150 : height * 0.2;
  const rise = mobile ? 0 : 0.4;
  const smoothY = (x: number) => {
    const u = clamp01((x - x0) / (x1 - x0));
    const v = clamp01((u - rise) / (1 - rise));
    const s = v * v * (3 - 2 * v);
    return lerp(yStart, yEnd, s);
  };
  const smooth: Point[] = Array.from({ length: COUNT }, (_, i) => {
    const x = lerp(x0, x1, i / (COUNT - 1));
    return { x, y: smoothY(x) };
  });

  const knot = mobile
    ? { x: width * 0.6, y: height - 100, r: Math.min(width * 0.13, 56) }
    : { x: width * 0.79, y: height * 0.5, r: Math.min(width * 0.095, height * 0.17, 140) };

  const tangled: Point[] = [
    { x: x0, y: yStart },
    { x: lerp(x0, knot.x, 0.6), y: yStart - (mobile ? 8 : height * 0.03) },
    { x: knot.x - knot.r * 1.6, y: knot.y + knot.r * 1.25 },
  ];
  let angle = Math.PI * 0.8;
  const loops = COUNT - 6;
  for (let k = 0; k < loops; k++) {
    angle += 1.1 + random() * 2.3;
    const radius = knot.r * (0.3 + random() * 0.85);
    const jitterX = (random() - 0.5) * knot.r * 0.5;
    const jitterY = (random() - 0.5) * knot.r * 0.4;
    tangled.push({
      x: knot.x + jitterX + Math.cos(angle) * radius * 1.2,
      y: knot.y + jitterY + Math.sin(angle) * radius * 0.95,
    });
  }
  tangled.push(
    { x: knot.x + knot.r * 1.65, y: knot.y - knot.r * 0.55 },
    { x: lerp(knot.x, x1, 0.6), y: lerp(knot.y - knot.r, smoothY(x1), 0.5) },
    { x: x1, y: smoothY(x1) },
  );

  const anchorX = width * 0.7;
  return {
    width,
    height,
    smooth,
    tangled,
    knot,
    noteBefore: { x: knot.x - knot.r * 0.3, y: knot.y - knot.r * 1.45 - 62 },
    noteAfter: { x: anchorX - 6, y: smoothY(anchorX) - 74 },
    mobile,
  };
}

const TIMING = {
  drawStart: 0.35,
  drawDuration: 1.7,
  untangleStart: 2.5,
  untangleDuration: 2.1,
  beadPeriod: 6.5,
};

export function HeroThread({ noteBefore, noteAfter }: { noteBefore: string; noteAfter: string }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const glowPath = useRef<SVGPathElement>(null);
  const mainPath = useRef<SVGPathElement>(null);
  const bead = useRef<SVGGElement>(null);
  const layoutRef = useRef<Layout | null>(null);
  const startRef = useRef<number | null>(null);
  const doneRef = useRef(false);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [untangled, setUntangled] = useState(false);

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width < 10 || height < 10) return;
      const next = buildLayout(width, height);
      layoutRef.current = next;
      setLayout(next);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!layout) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower = document.documentElement.classList.contains("low-power");
    let frame = 0;
    let visible = true;
    const start = (startRef.current ??= performance.now());

    const render = (now: number) => {
      const current = layoutRef.current;
      const path = mainPath.current;
      if (!current || !path) return;
      const t = reduce ? 99 : (now - start) / 1000;

      const draw = easeOut(clamp01((t - TIMING.drawStart) / TIMING.drawDuration));
      const untangle = clamp01((t - TIMING.untangleStart) / TIMING.untangleDuration);
      const amplitude = reduce || lowPower ? 0 : current.mobile ? 4 : 7;

      const points = current.tangled.map((p, i) => {
        const delay = (i / (COUNT - 1)) * 0.4;
        const local = easeInOut(clamp01((untangle - delay) / 0.6));
        const target = current.smooth[i];
        const wave = Math.sin(t * 0.9 + i * 0.55) * amplitude * local;
        return { x: lerp(p.x, target.x, local), y: lerp(p.y, target.y, local) + wave };
      });

      const segments = toSegments(points);
      const d = toPath(segments);
      path.setAttribute("d", d);
      glowPath.current?.setAttribute("d", d);
      path.style.strokeDashoffset = String(1 - draw);
      if (glowPath.current) glowPath.current.style.strokeDashoffset = String(1 - draw);

      if (untangle > 0.5 && !doneRef.current) {
        doneRef.current = true;
        setUntangled(true);
      }

      const beadEl = bead.current;
      if (beadEl) {
        const beadTime = t - TIMING.untangleStart - TIMING.untangleDuration;
        if (beadTime > 0 && !reduce) {
          const phase = (beadTime % TIMING.beadPeriod) / TIMING.beadPeriod;
          const pt = pointAlong(segments, phase);
          beadEl.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
          beadEl.style.opacity = String(Math.sin(phase * Math.PI) * 0.95);
        } else {
          beadEl.style.opacity = "0";
        }
      }
    };

    const loop = (now: number) => {
      render(now);
      const settled = reduce || (lowPower && now - start > 6000);
      if (visible && !settled) frame = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      if (visible && !wasVisible) frame = requestAnimationFrame(loop);
      if (!visible) cancelAnimationFrame(frame);
    });
    if (wrapper.current) observer.observe(wrapper.current);

    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [layout]);

  return (
    <div ref={wrapper} aria-hidden className="pointer-events-none absolute inset-0">
      {layout && (
        <>
          <div
            className="absolute size-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,var(--glow-1),transparent)] opacity-80 max-md:size-[22rem]"
            style={{ left: layout.knot.x, top: layout.knot.y }}
          />
          <svg
            className="absolute inset-0 h-full w-full overflow-visible"
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            fill="none"
          >
            <defs>
              <linearGradient id="thread-gradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={layout.width} y2="0">
                <stop offset="0" style={{ stopColor: "var(--grape)" }} />
                <stop offset="0.45" style={{ stopColor: "var(--rose)" }} />
                <stop offset="0.8" style={{ stopColor: "var(--coral)" }} />
                <stop offset="1" style={{ stopColor: "var(--sun)" }} />
              </linearGradient>
            </defs>
            <path
              ref={glowPath}
              pathLength={1}
              strokeDasharray="1 2"
              strokeDashoffset="1"
              strokeWidth={layout.mobile ? 10 : 16}
              strokeLinecap="round"
              stroke="url(#thread-gradient)"
              className="opacity-[0.16] dark:opacity-25"
            />
            <path
              ref={mainPath}
              pathLength={1}
              strokeDasharray="1 2"
              strokeDashoffset="1"
              stroke="url(#thread-gradient)"
              strokeWidth={layout.mobile ? 2 : 2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <g ref={bead} style={{ opacity: 0 }}>
              <circle r="14" className="fill-rose opacity-25" />
              <circle r="4" className="fill-rose" />
            </g>
          </svg>

          {!layout.mobile && (
            <motion.div
              className="absolute top-0 left-0 hidden lg:block"
              initial={{ opacity: 0, x: layout.noteBefore.x, y: layout.noteBefore.y }}
              animate={{
                opacity: 1,
                x: untangled ? layout.noteAfter.x : layout.noteBefore.x,
                y: untangled ? layout.noteAfter.y : layout.noteBefore.y,
              }}
              transition={{
                opacity: { delay: 1.4, duration: 0.8 },
                default: { duration: 1.4, ease: EASE },
              }}
            >
              <motion.div
                initial={{ x: "-50%" }}
                animate={{ x: untangled ? "-100%" : "-50%" }}
                transition={{ duration: 1.4, ease: EASE }}
                className={cn("flex flex-col", untangled ? "items-end text-right" : "items-center text-center")}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={untangled ? "after" : "before"}
                    initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="font-display text-lg whitespace-nowrap text-ink-soft italic [font-variation-settings:'SOFT'_100,'WONK'_1]"
                  >
                    {untangled ? noteAfter : noteBefore}
                  </motion.p>
                </AnimatePresence>
                <svg
                  viewBox="0 0 40 34"
                  className={cn("mt-1 h-8 w-9 text-ink-faint transition-transform duration-700", untangled && "translate-x-5")}
                  fill="none"
                >
                  <path
                    d="M8 3 C 4 14, 12 24, 26 29 M 19 30.5 L 26.5 29.2 L 22.5 22.8"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
