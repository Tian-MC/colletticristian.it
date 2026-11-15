import { Eyebrow } from "@/components/brand";
import { Rich } from "@/components/rich";
import { SiteFooter } from "@/components/sections/home";
import { getDictionary } from "@/content/i18n";
import type { Locale, PrivacyBlock } from "@/content/types";

const link = "text-violet underline underline-offset-4";

export function PrivacyPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <>
      <main id={t.ids.main} className="container-site max-w-3xl pt-36 pb-24 md:pt-44 md:pb-32">
        <Eyebrow>{t.privacy.eyebrow}</Eyebrow>

        <h1 className="mt-6 font-display text-[clamp(2.4rem,5vw,4rem)] leading-[1] font-[380] tracking-[-0.03em] text-ink">
          {t.privacy.title}
        </h1>

        <p className="mt-8 leading-relaxed text-ink-soft">{t.privacy.intro}</p>

        <div className="mt-14 space-y-12 text-lg leading-relaxed text-pretty text-ink-soft">
          {t.privacy.blocks.map((block) => (
            <Block key={block.title} block={block} />
          ))}

          <p className="border-t border-line pt-8 text-sm text-ink-faint">{t.privacy.updated}</p>
        </div>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}

function Block({ block }: { block: PrivacyBlock }) {
  return (
    <section className="border-t border-line pt-8">
      <h2 className="font-display text-[1.75rem] leading-tight tracking-[-0.02em] text-ink">{block.title}</h2>

      <div className="mt-4 space-y-4">
        {block.content.map((part, i) =>
          Array.isArray(part) ? (
            <ul key={i} className="list-disc space-y-3 pl-5">
              {part.map((item) => (
                <li key={item}>
                  <Rich text={item} strong="text-ink" link={link} />
                </li>
              ))}
            </ul>
          ) : (
            <p key={i}>
              <Rich text={part} strong="text-ink" link={link} />
            </p>
          ),
        )}
      </div>
    </section>
  );
}
