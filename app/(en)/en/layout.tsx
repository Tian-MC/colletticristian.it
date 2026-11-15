import type { Metadata } from "next";
import { SiteShell } from "../../site-shell";
import { layoutMetadata, viewport } from "@/lib/seo";
import "../../globals.css";

export const metadata: Metadata = layoutMetadata("en");
export { viewport };

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="en">{children}</SiteShell>;
}
