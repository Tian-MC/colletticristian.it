import type { Metadata } from "next";
import { PrivacyPage } from "@/components/sections/privacy-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("en", "privacy");

export default function EnglishPrivacy() {
  return <PrivacyPage locale="en" />;
}
