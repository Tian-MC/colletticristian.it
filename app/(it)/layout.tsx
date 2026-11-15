import type { Metadata } from "next";
import { SiteShell } from "../site-shell";
import { layoutMetadata, viewport } from "@/lib/seo";
import "../globals.css";

export const metadata: Metadata = layoutMetadata("it");
export { viewport };

export default function ItalianLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="it">{children}</SiteShell>;
}
