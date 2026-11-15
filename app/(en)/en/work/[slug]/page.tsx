import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyPage } from "@/components/pages/case-study-page";
import { caseBySlug, caseKeys, casePage, caseSlug } from "@/content/i18n";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return caseKeys.map((key) => ({ slug: caseSlug(key, "en") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const key = caseBySlug((await params).slug, "en");
  return key ? pageMetadata("en", casePage(key)) : {};
}

export default async function EnglishCaseStudy({ params }: Props) {
  const key = caseBySlug((await params).slug, "en");
  if (!key) notFound();
  return <CaseStudyPage locale="en" caseKey={key} />;
}
