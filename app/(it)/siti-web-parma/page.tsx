import type { Metadata } from "next";
import { ServicePage } from "@/components/pages/service-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("it", "websites");

export default function ItalianWebsites() {
  return <ServicePage locale="it" service="websites" />;
}
