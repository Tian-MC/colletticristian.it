import type { Metadata } from "next";
import { Home } from "@/components/sections/home";
import { StructuredData } from "@/components/structured-data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("en", "home");

export default function EnglishHome() {
  return (
    <>
      <StructuredData locale="en" />
      <Home locale="en" />
    </>
  );
}
