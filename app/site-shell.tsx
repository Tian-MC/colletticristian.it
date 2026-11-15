import type { ReactNode } from "react";
import { AmbientBackground } from "@/components/ambient-background";
import { FpsMonitor } from "@/components/debug/fps-monitor";
import { MobileCta } from "@/components/nav/mobile-cta";
import { SiteNav } from "@/components/nav/site-nav";
import { Providers } from "@/components/providers";
import { getDictionary, otherLocale, paths, serviceKeys } from "@/content/i18n";
import { whatsappHref } from "@/content/site";
import type { Locale } from "@/content/types";
import { display, text } from "@/lib/fonts";
import { themeInitScript } from "@/lib/theme";

export function SiteShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const t = getDictionary(locale);
  const other = otherLocale(locale);
  const home = paths.home[locale];

  return (
    <html lang={locale} suppressHydrationWarning className={`${display.variable} ${text.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body suppressHydrationWarning className="min-h-screen antialiased">
        <a
          href={`#${t.ids.main}`}
          className="fixed top-3 left-3 z-[60] -translate-y-20 rounded-full bg-cta px-4 py-2 text-sm text-on-cta transition-transform focus:translate-y-0"
        >
          {t.ui.skipLink}
        </a>
        <Providers>
          <AmbientBackground />
          <SiteNav
            home={home}
            ids={t.ids}
            navigation={t.navigation}
            services={serviceKeys.map((key) => ({ key, href: paths[key][locale], ...t.ui.navGroups.serviceLinks[key] }))}
            ui={t.ui}
            whatsappHref={whatsappHref(t.contactInfo.whatsappText)}
            responseNote={t.contactInfo.responseNote}
            language={{
              current: locale,
              other,
              paths,
              ids: t.ids,
              otherIds: getDictionary(other).ids,
              label: t.ui.language.label,
              switchTo: t.ui.language.switchTo,
            }}
          />
          {children}
          <MobileCta
            href={`#${t.ids.contact}`}
            watch={[t.ids.contact]}
            cta={t.cta.primary}
            whatsappHref={whatsappHref(t.contactInfo.whatsappText)}
            whatsappLabel={t.ui.whatsappLabel}
          />
          <FpsMonitor />
        </Providers>
      </body>
    </html>
  );
}
