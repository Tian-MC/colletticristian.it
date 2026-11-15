import type { Metadata } from "next";
import { ServicePage } from "@/components/pages/service-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("en", "support");

export default function EnglishSupport() {
  return <ServicePage locale="en" service="support" />;
}
