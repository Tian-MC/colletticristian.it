import type { Metadata } from "next";
import { Home } from "@/components/sections/home";
import { StructuredData } from "@/components/structured-data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("it", "home");

export default function ItalianHome() {
  return (
    <>
      <StructuredData locale="it" />
      <Home locale="it" />
    </>
  );
}
