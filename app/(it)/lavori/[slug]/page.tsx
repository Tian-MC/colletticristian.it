import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyPage } from "@/components/pages/case-study-page";
import { caseBySlug, caseKeys, casePage, caseSlug } from "@/content/i18n";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return caseKeys.map((key) => ({ slug: caseSlug(key, "it") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const key = caseBySlug((await params).slug, "it");
  return key ? pageMetadata("it", casePage(key)) : {};
}

export default async function ItalianCaseStudy({ params }: Props) {
  const key = caseBySlug((await params).slug, "it");
  if (!key) notFound();
  return <CaseStudyPage locale="it" caseKey={key} />;
}
