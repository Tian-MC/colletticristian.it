import { getDictionary, paths } from "@/content/i18n";
import { site } from "@/content/site";
import type { Locale } from "@/content/types";

export function StructuredData({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const url = `${site.url}${paths.home[locale]}`;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}#sito`,
        url,
        name: site.name,
        inLanguage: t.meta.language,
        publisher: { "@id": `${site.url}/#servizio` },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${site.url}/#servizio`,
        name: site.name,
        url: site.url,
        description: t.meta.description,
        logo: `${site.url}/logo.png`,
        image: `${site.url}/og/tian-${locale}.jpg`,
        email: site.email,
        telephone: site.phoneHref.replace("tel:", ""),
        address: { "@type": "PostalAddress", addressLocality: site.city, addressRegion: site.region, addressCountry: "IT" },
        areaServed: [{ "@type": "City", name: site.city }, { "@type": "Country", name: locale === "en" ? "Italy" : "Italia" }],
        founder: {
          "@type": "Person",
          name: "Cristian Colletti",
          alternateName: site.name,
          sameAs: site.profiles.map((profile) => profile.href),
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
