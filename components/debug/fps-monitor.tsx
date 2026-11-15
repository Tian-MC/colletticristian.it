"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

type Activity = "fermo" | "scroll" | "mouse" | "tema";
type Bucket = { frames: number; time: number; worst: number; long: number };

const ACTIVITIES: Activity[] = ["fermo", "scroll", "mouse", "tema"];
const emptyBuckets = () =>
  Object.fromEntries(ACTIVITIES.map((a) => [a, { frames: 0, time: 0, worst: 0, long: 0 }])) as Record<Activity, Bucket>;

declare global {
  interface Window {
    __fps?: { snapshot: () => unknown; reset: () => void };
  }
}

const noSubscription = () => () => {};

export function FpsMonitor() {
  const enabled = useSyncExternalStore(
    noSubscription,
    () => new URLSearchParams(window.location.search).has("fps"),
    () => false,
  );
  return enabled ? <Monitor /> : null;
}

function Monitor() {
  const text = useRef<HTMLPreElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const intervals: number[] = [];
    const stamps: number[] = [];
    const domFrames: number[] = [];
    const scrollFrames: number[] = [];
    let buckets = emptyBuckets();
    let loaf = 0;
    let last = 0;
    let lastText = 0;
    let mutated = false;
    let lastScrollY = window.scrollY;
    const lastEvent = { scroll: -1e9, mouse: -1e9, tema: -1e9 };

    const mutations = new MutationObserver(() => (mutated = true));
    mutations.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["style", "d", "transform"] });
    let wasDark = document.documentElement.classList.contains("dark");
    const theme = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      if (isDark !== wasDark) lastEvent.tema = performance.now();
      wasDark = isDark;
    });
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const onScroll = () => (lastEvent.scroll = performance.now());
    const onPointer = () => (lastEvent.mouse = performance.now());
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });

    let loafObserver: PerformanceObserver | undefined;
    try {
      loafObserver = new PerformanceObserver((list) => (loaf += list.getEntries().length));
      loafObserver.observe({ type: "long-animation-frame", buffered: false });
    } catch {
      /* API non disponibile */
    }

    const activityAt = (t: number): Activity => {
      if (t - lastEvent.tema < 900) return "tema";
      if (t - lastEvent.scroll < 150) return "scroll";
      if (t - lastEvent.mouse < 120) return "mouse";
      return "fermo";
    };

    const median = (values: number[]) => {
      if (!values.length) return 0;
      const sorted = [...values].sort((a, b) => a - b);
      return sorted[Math.floor(sorted.length / 2)];
    };
    const percentile = (values: number[], p: number) => {
      if (!values.length) return 0;
      const sorted = [...values].sort((a, b) => a - b);
      return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
    };

    const snapshot = () => {
      const med = median(intervals);
      const per: Record<string, { fps: number; frames: number; worstMs: number; longFrames: number }> = {};
      for (const a of ACTIVITIES) {
        const b = buckets[a];
        per[a] = {
          fps: b.time ? Math.round((b.frames / b.time) * 1000) : 0,
          frames: b.frames,
          worstMs: Math.round(b.worst * 10) / 10,
          longFrames: b.long,
        };
      }
      return {
        rafPerSecond: stamps.length,
        estimatedHz: med ? Math.round(1000 / med) : 0,
        medianMs: Math.round(med * 100) / 100,
        p95Ms: Math.round(percentile(intervals, 0.95) * 100) / 100,
        worstMs: Math.round(Math.max(0, ...intervals) * 10) / 10,
        domUpdatesPerSecond: domFrames.length,
        scrollUpdatesPerSecond: scrollFrames.length,
        longAnimationFrames: loaf,
        perActivity: per,
      };
    };

    const reset = () => {
      buckets = emptyBuckets();
      intervals.length = 0;
      loaf = 0;
    };

    window.__fps = { snapshot, reset };

    const ctx = canvas.current?.getContext("2d");
    let raf = 0;

    const loop = (t: number) => {
      if (last) {
        const dt = t - last;
        intervals.push(dt);
        if (intervals.length > 480) intervals.shift();

        const med = median(intervals.slice(-120));
        const b = buckets[activityAt(t)];
        b.frames += 1;
        b.time += dt;
        b.worst = Math.max(b.worst, dt);
        if (med && dt > med * 1.5) b.long += 1;
      }
      last = t;

      stamps.push(t);
      while (stamps[0] < t - 1000) stamps.shift();

      if (mutated) domFrames.push(t);
      mutated = false;
      while (domFrames.length && domFrames[0] < t - 1000) domFrames.shift();

      if (window.scrollY !== lastScrollY) scrollFrames.push(t);
      lastScrollY = window.scrollY;
      while (scrollFrames.length && scrollFrames[0] < t - 1000) scrollFrames.shift();

      const redraw = t - lastText > 250;
      if (redraw && ctx && canvas.current) {
        const { width: w, height: h } = canvas.current;
        ctx.clearRect(0, 0, w, h);
        const maxMs = 25;
        ctx.strokeStyle = "rgba(255,255,255,0.35)";
        ctx.setLineDash([3, 3]);
        const y60 = h - (16.67 / maxMs) * h;
        ctx.beginPath();
        ctx.moveTo(0, y60);
        ctx.lineTo(w, y60);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeStyle = "#b9a2ff";
        ctx.beginPath();
        const recent = intervals.slice(-w);
        recent.forEach((ms, i) => {
          const y = h - (Math.min(ms, maxMs) / maxMs) * h;
          if (i === 0) ctx.moveTo(i, y);
          else ctx.lineTo(i, y);
        });
        ctx.stroke();
      }

      if (redraw && text.current) {
        lastText = t;
        const s = snapshot();
        const per = s.perActivity as Record<Activity, { fps: number; worstMs: number; longFrames: number }>;
        text.current.textContent =
          `rAF/s        ${s.rafPerSecond}\n` +
          `refresh      ~${s.estimatedHz} Hz  (mediana ${s.medianMs} ms)\n` +
          `p95 / peggio ${s.p95Ms} / ${s.worstMs} ms\n` +
          `DOM anim/s   ${s.domUpdatesPerSecond}   scroll/s ${s.scrollUpdatesPerSecond}\n` +
          `LoAF         ${s.longAnimationFrames}\n` +
          `attività     ${activityAt(t)}\n` +
          ACTIVITIES.map((a) => `${a.padEnd(7)} ${String(per[a].fps).padStart(4)} fps  max ${per[a].worstMs} ms`).join("\n");
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      mutations.disconnect();
      theme.disconnect();
      loafObserver?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onScroll);
      window.removeEventListener("pointermove", onPointer);
      delete window.__fps;
    };
  }, []);

  return (
    <div
      data-lenis-prevent
      className="fixed bottom-3 left-3 z-[100] w-[300px] rounded-xl bg-black/80 p-3 font-mono text-[11px] leading-[1.45] text-white shadow-2xl"
    >
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-semibold">FPS monitor (temporaneo)</span>
        <button type="button" onClick={() => window.__fps?.reset()} className="rounded bg-white/15 px-1.5 py-0.5 hover:bg-white/25">
          reset
        </button>
      </div>
      <canvas ref={canvas} width={276} height={40} className="mb-1.5 block w-full rounded bg-white/5" />
      <pre ref={text} className="whitespace-pre" />
    </div>
  );
}
