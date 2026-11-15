import type { Metadata, Viewport } from "next";
import { getDictionary, otherLocale, paths, type Page } from "@/content/i18n";
import { site } from "@/content/site";
import type { CaseKey, Dictionary, Locale, PageMeta, ServiceKey } from "@/content/types";

export function layoutMetadata(locale: Locale): Metadata {
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: t.meta.title, template: `%s · ${site.name}` },
    description: t.meta.description,
  };
}

export function pageMeta(t: Dictionary, page: Page): PageMeta {
  if (page === "home") return { title: t.meta.title, description: t.meta.description };
  if (page === "privacy") return { title: t.privacy.metaTitle, description: t.privacy.metaDescription };
  if (page.startsWith("case-")) return t.pages.cases[page.slice("case-".length) as CaseKey].meta;
  return t.pages.services[page as ServiceKey].meta;
}

export function pageMetadata(locale: Locale, page: Page): Metadata {
  const t = getDictionary(locale);
  const home = page === "home";
  const meta = pageMeta(t, page);
  const title = home ? meta.title : `${meta.title} · ${site.name}`;
  const description = meta.description;
  const socialTitle = home ? t.meta.ogTitle : title;
  const image = { url: `/og/tian-${locale}.jpg`, width: 1200, height: 630, alt: t.meta.ogImageAlt, type: "image/jpeg" };

  return {
    title: home ? { absolute: meta.title } : meta.title,
    description,
    alternates: {
      canonical: paths[page][locale],
      languages: { it: paths[page].it, en: paths[page].en, "x-default": paths[page].it },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      url: paths[page][locale],
      locale: t.meta.ogLocale,
      alternateLocale: getDictionary(otherLocale(locale)).meta.ogLocale,
      title: socialTitle,
      description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: socialTitle, description, images: [{ url: image.url, alt: image.alt }] },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5fb" },
    { media: "(prefers-color-scheme: dark)", color: "#120d1c" },
  ],
};
