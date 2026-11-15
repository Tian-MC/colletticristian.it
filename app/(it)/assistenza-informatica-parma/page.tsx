import type { Metadata } from "next";
import { ServicePage } from "@/components/pages/service-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("it", "support");

export default function ItalianSupport() {
  return <ServicePage locale="it" service="support" />;
}
