import { About } from "@/components/sections/about";
import { Approach } from "@/components/sections/approach";
import { Contact } from "@/components/sections/contact";
import { Faq } from "@/components/sections/faq";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Reviews } from "@/components/sections/reviews";
import { Services } from "@/components/sections/services";
import { Translator } from "@/components/sections/translator";
import { Work } from "@/components/sections/work";
import { casePage, getDictionary, paths, projectKeys, serviceKeys } from "@/content/i18n";
import { site, whatsappHref } from "@/content/site";
import type { Locale, ProjectKey, ServiceArtKey, ServiceKey } from "@/content/types";

const servicePages: Record<ServiceArtKey, ServiceKey> = {
  presence: "websites",
  time: "software",
  tools: "software",
  advice: "support",
  support: "support",
};

export function Home({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const whatsapp = whatsappHref(t.contactInfo.whatsappText);
  const caseHrefs = Object.fromEntries(projectKeys.map((p) => [p, paths[casePage(p)][locale]])) as Record<ProjectKey, string>;

  return (
    <>
      <main id={t.ids.main}>
        <Hero t={{ ...t.hero, cta: t.cta }} ids={t.ids} />
        <About t={t.about} id={t.ids.about} name={site.name} />
        <Translator t={t.translator} />
        <Services
          t={t.services}
          ids={t.ids}
          cta={t.cta}
          more={{
            label: t.pages.common.learnMore,
            links: Object.fromEntries(
              Object.entries(servicePages).map(([art, key]) => [art, { href: paths[key][locale], name: t.pages.services[key].nav }]),
            ) as Record<ServiceArtKey, { href: string; name: string }>,
          }}
        />
        <Work t={t.work} id={t.ids.work} caseHrefs={caseHrefs} />
        <Reviews t={t.reviews} id={t.ids.reviews} caseHrefs={caseHrefs} caseLink={t.work.caseLink} />
        <Approach t={t.approach} id={t.ids.process} />
        <Faq t={t.faq} ids={t.ids} cta={t.cta} />
        <Contact
          t={t.contact}
          id={t.ids.contact}
          info={t.contactInfo}
          whatsappHref={whatsapp}
          privacyHref={paths.privacy[locale]}
          locale={locale}
        />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <Footer
      t={t.footer}
      ids={t.ids}
      navigation={t.navigation}
      navLabel={t.ui.footerNav}
      hours={t.contactInfo.hours}
      whatsappHref={whatsappHref(t.contactInfo.whatsappText)}
      privacyHref={paths.privacy[locale]}
      services={serviceKeys.map((key) => ({ label: t.pages.services[key].nav, href: paths[key][locale] }))}
    />
  );
}
