import type { Metadata } from "next";
import { getDictionary, paths } from "@/content/i18n";
import { display, text } from "@/lib/fonts";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const it = getDictionary("it");
const en = getDictionary("en");

export const metadata: Metadata = {
  title: "404",
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <html lang="it" suppressHydrationWarning className={`${display.variable} ${text.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body suppressHydrationWarning className="grid min-h-screen place-items-center px-6 text-center antialiased">
        <main>
          <p className="font-display text-[clamp(4rem,12vw,8rem)] leading-none font-[360] tracking-[-0.04em] text-violet">
            404
          </p>
          <h1 className="mt-6 font-display text-[clamp(1.6rem,4vw,2.4rem)] leading-tight tracking-[-0.02em] text-balance text-ink">
            Pagina non trovata · Page not found
          </h1>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href={paths.home.it}
              hrefLang="it"
              className="rounded-full bg-cta px-6 py-3 text-[0.95rem] font-medium text-on-cta"
            >
              {it.ui.backHome}
            </a>
            <a
              href={paths.home.en}
              hrefLang="en"
              className="rounded-full border border-line px-6 py-3 text-[0.95rem] font-medium text-ink transition-colors hover:border-violet/45"
            >
              {en.ui.backHome}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
