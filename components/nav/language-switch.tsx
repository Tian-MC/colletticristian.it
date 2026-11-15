"use client";

import { usePathname } from "next/navigation";
import { pageOf, type Page } from "@/content/paths";
import type { Dictionary, Locale } from "@/content/types";
import { cn } from "@/lib/utils";

type Ids = Dictionary["ids"];

export type LanguageProps = {
  current: Locale;
  other: Locale;
  paths: Record<Page, Record<Locale, string>>;
  ids: Ids;
  otherIds: Ids;
  label: string;
  switchTo: string;
};

const SHORT: Record<Locale, string> = { it: "IT", en: "EN" };

function translateHash(hash: string, ids: Ids, otherIds: Ids) {
  const id = hash.replace(/^#/, "");
  if (!id) return "";
  const key = (Object.keys(ids) as (keyof Ids)[]).find((k) => ids[k] === id);
  return key ? `#${otherIds[key]}` : "";
}

export function LanguageSwitch({
  current,
  other,
  paths,
  ids,
  otherIds,
  label,
  switchTo,
  className,
}: LanguageProps & { className?: string }) {
  const pathname = usePathname();
  const page: Page = pageOf(pathname);
  const href = paths[page][other];

  return (
    <div role="group" aria-label={label} className={cn("flex items-center gap-0.5 text-[0.82rem] font-medium", className)}>
      <span aria-current="true" className="grid h-7 min-w-7 place-items-center text-ink">
        {SHORT[current]}
      </span>
      <span aria-hidden className="text-ink-faint">
        ·
      </span>
      <a
        href={href}
        hrefLang={other}
        aria-label={switchTo}
        onClick={(event) => {
          if (page !== "home") return;
          const hash = translateHash(window.location.hash, ids, otherIds);
          if (hash) event.currentTarget.href = `${href}${hash}`;
        }}
        className="grid h-7 min-w-7 place-items-center rounded-full text-ink-faint transition-colors duration-300 hover:text-ink"
      >
        {SHORT[other]}
      </a>
    </div>
  );
}
