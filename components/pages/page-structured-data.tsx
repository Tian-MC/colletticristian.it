import { getDictionary, paths, type Page } from "@/content/i18n";
import { site } from "@/content/site";
import type { CaseKey, Locale, ServiceKey } from "@/content/types";
import { pageMeta } from "@/lib/seo";
import { caseInfo } from "./cases";

export function PageStructuredData({ locale, page }: { locale: Locale; page: Exclude<Page, "home" | "privacy"> }) {
  const t = getDictionary(locale);
  const abs = (path: string) => (path === "/" ? site.url : `${site.url}${path}`);
  const url = abs(paths[page][locale]);
  const meta = pageMeta(t, page);
  const provider = { "@id": `${site.url}/#servizio` };
  const isCase = page.startsWith("case-");
  const key = isCase ? (page.slice("case-".length) as CaseKey) : null;
  const name = key ? t.pages.cases[key].nav : t.pages.services[page as ServiceKey].nav;

  const breadcrumbs = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.pages.common.breadcrumbHome, item: abs(paths.home[locale]) },
      { "@type": "ListItem", position: 2, name, item: url },
    ],
  };

  const info = key ? caseInfo(t, key) : null;
  const main = key && info
    ? {
        "@type": "CreativeWork",
        "@id": `${url}#lavoro`,
        name: t.pages.cases[key].meta.title,
        description: meta.description,
        url,
        inLanguage: t.meta.language,
        image: `${site.url}${info.image}`,
        ...(t.pages.cases[key].authored ? { creator: provider } : {}),
        about: info.domain
          ? { "@type": "WebSite", name: info.name, url: `https://${info.domain}` }
          : { "@type": "WebApplication", name: info.name, applicationCategory: "BusinessApplication", browserRequirements: "Browser web" },
      }
    : {
        "@type": "Service",
        "@id": `${url}#servizio`,
        name: meta.title,
        serviceType: t.pages.services[page as ServiceKey].serviceType,
        description: meta.description,
        url,
        provider,
        areaServed: { "@type": "City", name: site.city },
      };

  const data = { "@context": "https://schema.org", "@graph": [breadcrumbs, main] };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
