import type { CaseKey, Locale, ServiceKey } from "./types";

export type CasePage = `case-${CaseKey}`;
export type Page = "home" | "privacy" | ServiceKey | CasePage;

export const paths: Record<Page, Record<Locale, string>> = {
  home: { it: "/", en: "/en" },
  websites: { it: "/siti-web-parma", en: "/en/websites" },
  software: { it: "/gestionali-su-misura", en: "/en/custom-software" },
  support: { it: "/assistenza-informatica-parma", en: "/en/it-support" },
  "case-mascari": { it: "/lavori/mascari-assicurazioni", en: "/en/work/mascari-assicurazioni" },
  "case-ducato": { it: "/lavori/ducato-nerd", en: "/en/work/ducato-nerd" },
  "case-vip": { it: "/lavori/visual-italian-project", en: "/en/work/visual-italian-project" },
  "case-ensemble": { it: "/lavori/ensemble-sinistri", en: "/en/work/ensemble-sinistri" },
  privacy: { it: "/privacy", en: "/en/privacy" },
};

export const serviceKeys: readonly ServiceKey[] = ["websites", "software", "support"];
export const projectKeys = ["mascari", "ducato", "vip", "ensemble"] as const;
export const caseKeys: readonly CaseKey[] = projectKeys;

export const casePage = (key: CaseKey): CasePage => `case-${key}`;

export function caseSlug(key: CaseKey, locale: Locale) {
  return paths[casePage(key)][locale].split("/").pop()!;
}

export function caseBySlug(slug: string, locale: Locale): CaseKey | undefined {
  return caseKeys.find((key) => caseSlug(key, locale) === slug);
}

export function pageOf(pathname: string): Page {
  const clean = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  const found = (Object.keys(paths) as Page[]).find((page) => paths[page].it === clean || paths[page].en === clean);
  return found ?? "home";
}
