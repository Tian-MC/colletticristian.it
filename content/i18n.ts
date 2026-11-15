import { en } from "./en";
import { it } from "./it";
import type { Dictionary, Locale } from "./types";

export * from "./paths";

export const locales: readonly Locale[] = ["it", "en"];

const dictionaries: Record<Locale, Dictionary> = { it, en };

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export function otherLocale(locale: Locale): Locale {
  return locale === "it" ? "en" : "it";
}
