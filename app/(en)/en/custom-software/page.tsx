import type { Metadata } from "next";
import { ServicePage } from "@/components/pages/service-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("en", "software");

export default function EnglishSoftware() {
  return <ServicePage locale="en" service="software" />;
}
