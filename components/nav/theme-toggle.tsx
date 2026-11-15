"use client";

import { useId, useRef } from "react";
import { cn } from "@/lib/utils";
import { switchTheme, useTheme } from "@/lib/theme";

export function ThemeToggle({ className, label, toDark, toLight }: { className?: string; label: string; toDark: string; toLight: string }) {
  const theme = useTheme();
  const isDark = theme === "dark";
  const ref = useRef<HTMLButtonElement>(null);
  const maskId = `moon${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  function toggle() {
    const rect = ref.current?.getBoundingClientRect();
    const current = document.documentElement.classList.contains("dark") ? "dark" : "light";
    switchTheme(
      current === "dark" ? "light" : "dark",
      rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : undefined,
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={label}
      title={isDark ? toLight : toDark}
      onClick={toggle}
      className={cn(
        "group relative h-10 w-[4.25rem] shrink-0 rounded-full border border-line bg-paper-2/80 p-1 transition-[border-color] duration-300 hover:border-violet/45 dark:bg-[oklch(0.12_0.045_292)]",
        className,
      )}
    >
      <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
        {[
          { l: "18%", t: "30%", d: "0ms", s: "size-[3px]" },
          { l: "34%", t: "62%", d: "120ms", s: "size-[2px]" },
          { l: "12%", t: "68%", d: "60ms", s: "size-[2px]" },
        ].map((star) => (
          <span
            key={star.l + star.t}
            data-theme-anim
            style={{ left: star.l, top: star.t, transitionDelay: star.d }}
            className={cn(
              "absolute scale-0 rounded-full bg-[oklch(0.92_0.06_300)] opacity-0 transition-[opacity,scale] duration-500 dark:scale-100 dark:opacity-100",
              star.s,
            )}
          />
        ))}
      </span>

      <span
        data-theme-anim
        className="relative grid size-8 place-items-center rounded-full bg-surface text-violet shadow-[0_2px_10px_-2px_var(--shadow-tint)] transition-transform duration-700 ease-[cubic-bezier(0.34,1.4,0.5,1)] group-hover:shadow-[0_4px_16px_-4px_var(--violet)] dark:translate-x-[1.625rem]"
      >
        <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden>
          <mask id={maskId}>
            <rect width="24" height="24" fill="white" />
            <circle
              data-theme-anim
              cx="19"
              cy="5"
              r="6.5"
              fill="black"
              className="translate-x-[9px] -translate-y-[9px] transition-transform duration-700 ease-silk dark:translate-x-0 dark:translate-y-0"
            />
          </mask>
          <circle
            data-theme-anim
            cx="12"
            cy="12"
            r="8"
            fill="currentColor"
            mask={`url(#${maskId})`}
            className="origin-center scale-[0.55] transition-transform duration-700 ease-silk [transform-box:fill-box] dark:scale-100"
          />
          <g
            data-theme-anim
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="origin-center transition-[opacity,scale,rotate] duration-500 ease-silk [transform-box:view-box] dark:scale-50 dark:-rotate-90 dark:opacity-0"
          >
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i * Math.PI) / 4;
              const x1 = 12 + Math.cos(a) * 7.6;
              const y1 = 12 + Math.sin(a) * 7.6;
              const x2 = 12 + Math.cos(a) * 10;
              const y2 = 12 + Math.sin(a) * 10;
              return <line key={i} x1={x1.toFixed(2)} y1={y1.toFixed(2)} x2={x2.toFixed(2)} y2={y2.toFixed(2)} />;
            })}
          </g>
        </svg>
      </span>
    </button>
  );
}
