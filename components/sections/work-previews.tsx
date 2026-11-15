import { projectDomains } from "@/content/site";
import type { ProjectKey } from "@/content/types";
import { cn } from "@/lib/utils";

type Size = { width: number; height: number };

const shots: Record<ProjectKey, { desktop: Size; mobile?: Size }> = {
  mascari: { desktop: { width: 1280, height: 800 }, mobile: { width: 540, height: 1169 } },
  ducato: { desktop: { width: 1280, height: 800 }, mobile: { width: 540, height: 1169 } },
  vip: { desktop: { width: 1040, height: 650 } },
  ensemble: { desktop: { width: 1680, height: 886 }, mobile: { width: 400, height: 832 } },
};

const variantWidths = { desktop: [640, 960], mobile: [320] } as const;

export function shotSrcSet(id: ProjectKey, kind: "desktop" | "mobile") {
  const size = shots[id][kind];
  if (!size) return undefined;
  const smaller = variantWidths[kind].filter((width) => width < size.width);
  return [...smaller.map((width) => `/work/${id}-${kind}-${width}.webp ${width}w`), `/work/${id}-${kind}.webp ${size.width}w`].join(", ");
}

export function ProjectPreview({ id, label, barLabel }: { id: ProjectKey; label: string; barLabel?: string }) {
  const { desktop, mobile } = shots[id];
  return (
    <div
      role="img"
      aria-label={label}
      className="relative h-full min-h-[19.5rem] overflow-hidden rounded-[1.75rem] border border-line/70 md:min-h-[30rem]"
    >
      <div className={cn("absolute inset-0", backdrops[id])} />

      <div
        className={cn(
          "absolute top-[8%] left-[5%] w-[82%] overflow-hidden rounded-2xl border border-line/60 bg-surface shadow-[0_30px_60px_-30px_rgb(30_10_60/0.45)] group-hover:-translate-y-1.5",
          lift,
        )}
      >
        <BrowserBar url={barLabel ?? projectDomains[id] ?? ""} />
        <div className="relative overflow-hidden" style={{ aspectRatio: `${desktop.width} / ${desktop.height}` }}>
          <Shot
            src={`/work/${id}-desktop.webp`}
            srcSet={shotSrcSet(id, "desktop")}
            sizes="(min-width: 1024px) 640px, 80vw"
            {...desktop}
            zoom
          />
        </div>
      </div>

      <div
        className={cn(
          "absolute top-[27%] right-[5%] w-[29%] max-w-[11.5rem] md:top-[34%] overflow-hidden rounded-[1.6rem] border-[5px] border-[oklch(0.2_0.03_295)] bg-paper shadow-[0_40px_80px_-30px_rgb(20_5_50/0.6)] group-hover:-translate-y-3",
          lift,
        )}
      >
        <div className="relative aspect-[540/1169] overflow-hidden">
          {mobile ? (
            <Shot src={`/work/${id}-mobile.webp`} srcSet={shotSrcSet(id, "mobile")} sizes="(min-width: 768px) 184px, 26vw" {...mobile} />
          ) : (
            <VipMobile />
          )}
        </div>
      </div>
    </div>
  );
}

const lift = "transition-transform duration-700 ease-silk";

const backdrops: Record<ProjectKey, string> = {
  mascari:
    "bg-[linear-gradient(150deg,oklch(0.93_0.03_350),oklch(0.86_0.06_325))] dark:bg-[linear-gradient(150deg,oklch(0.3_0.07_345),oklch(0.21_0.05_300))]",
  ducato:
    "bg-[linear-gradient(150deg,oklch(0.91_0.05_20),oklch(0.85_0.07_300))] dark:bg-[linear-gradient(150deg,oklch(0.29_0.08_20),oklch(0.21_0.06_295))]",
  vip: "bg-[linear-gradient(150deg,oklch(0.92_0.03_230),oklch(0.86_0.05_285))] dark:bg-[linear-gradient(150deg,oklch(0.27_0.04_230),oklch(0.2_0.04_285))]",
  ensemble:
    "bg-[linear-gradient(150deg,oklch(0.94_0.025_15),oklch(0.87_0.05_340))] dark:bg-[linear-gradient(150deg,oklch(0.28_0.06_10),oklch(0.2_0.05_320))]",
};

export function BrowserBar({ url }: { url: string }) {
  return (
    <div className="flex h-8 items-center gap-1.5 border-b border-line/60 px-3">
      <span className="size-2 rounded-full bg-line" />
      <span className="size-2 rounded-full bg-line" />
      <span className="size-2 rounded-full bg-line" />
      <span className="mx-auto flex h-4 w-1/2 items-center justify-center truncate rounded-full bg-paper-2 px-2 text-[9px] text-ink-faint">
        {url}
      </span>
    </div>
  );
}

function Shot({ src, srcSet, sizes, width, height, zoom }: Size & { src: string; srcSet?: string; sizes: string; zoom?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt=""
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className={cn(
        "absolute inset-0 size-full object-cover object-top",
        zoom && "transition-transform duration-[1.4s] ease-silk group-hover:scale-[1.03]",
      )}
    />
  );
}

const vip = {
  bg: "bg-[#0b0c0e]",
  ink: "text-[#c9ced4]",
  dim: "text-[#7b838c]",
  rule: "border-[#272c31]",
  sans: "[font-family:Verdana,Arial,sans-serif]",
};

function VipMobile() {
  return (
    <div className="@container absolute inset-0 bg-[#050608]">
      <div className="flex h-full items-center px-[4cqw]">
        <div className={cn("w-full border px-[5cqw] py-[8cqw] text-center", vip.rule, vip.bg, vip.ink, vip.sans)}>
          <span className="inline-block border border-[#b1935e] px-[2.5cqw] py-[1cqw] font-mono text-[5cqw] text-[#b1935e]">18+</span>
          <p className="mt-[4cqw] text-[3.4cqw] font-bold tracking-[0.16em]">AVVISO — CONTENUTI PER ADULTI</p>
          <div className="mt-[4cqw] h-px bg-[#272c31]" />
          <p className="mt-[4cqw] text-[3.8cqw] leading-[1.6] opacity-90">
            Questo sito è destinato esclusivamente a un pubblico maggiorenne.
          </p>
          <p className="mt-[3cqw] text-[3.8cqw] leading-[1.6] opacity-90">Entrando dichiari di avere almeno 18 anni.</p>
          <p className="mx-auto mt-[6cqw] w-fit border-[3px] border-double border-[#a8c4cf] px-[3cqw] py-[1.5cqw] font-mono text-[3.2cqw] tracking-[0.06em] whitespace-nowrap text-[#a8c4cf]">
            [ HO 18 ANNI O PIÙ — ENTRA ]
          </p>
          <p className="mx-auto mt-[5cqw] w-fit border border-[#a8c4cf] px-[5cqw] py-[1.5cqw] font-mono text-[3.5cqw] tracking-[0.1em] text-[#a8c4cf]">
            [ ESCI ]
          </p>
          <p className={cn("mt-[5cqw] text-[3cqw]", vip.dim)}>La scelta viene ricordata da questo browser.</p>
        </div>
      </div>
    </div>
  );
}
