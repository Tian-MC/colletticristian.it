import type { Metadata } from "next";
import { ServicePage } from "@/components/pages/service-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("en", "websites");

export default function EnglishWebsites() {
  return <ServicePage locale="en" service="websites" />;
}
