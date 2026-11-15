import type { Metadata } from "next";
import { PrivacyPage } from "@/components/sections/privacy-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("it", "privacy");

export default function ItalianPrivacy() {
  return <PrivacyPage locale="it" />;
}
