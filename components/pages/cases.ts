import { shotSrcSet } from "@/components/sections/work-previews";
import { projectDomains } from "@/content/site";
import type { CaseKey, Dictionary, ServiceKey } from "@/content/types";

export const caseTones: Record<CaseKey, string> = {
  mascari: "tone-rose",
  ducato: "tone-coral",
  vip: "tone-sky",
  ensemble: "tone-rose",
};

export const sameClient: Partial<Record<CaseKey, CaseKey>> = {
  mascari: "ensemble",
  ensemble: "mascari",
};

export const caseServices: Record<CaseKey, ServiceKey> = {
  mascari: "websites",
  ducato: "websites",
  vip: "websites",
  ensemble: "software",
};

export function caseInfo(t: Dictionary, key: CaseKey) {
  const page = t.pages.cases[key];
  const project = t.work.projects.find((p) => p.id === key);
  return {
    name: page.nav,
    kind: project?.kind ?? "",
    previewLabel: project?.previewLabel ?? "",
    domain: projectDomains[key],
    image: `/work/${key}-desktop.webp`,
    imageSrcSet: shotSrcSet(key, "desktop"),
  };
}
