import type { Metadata } from "next";
import { ServicePage } from "@/components/pages/service-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("it", "software");

export default function ItalianSoftware() {
  return <ServicePage locale="it" service="software" />;
}
