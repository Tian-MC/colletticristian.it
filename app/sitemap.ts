import type { MetadataRoute } from "next";
import { paths } from "@/content/i18n";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => (path === "/" ? site.url : `${site.url}${path}`);

  return Object.values(paths).flatMap((page) =>
    Object.values(page).map((path) => ({
      url: url(path),
      alternates: { languages: { it: url(page.it), en: url(page.en) } },
    })),
  );
}
