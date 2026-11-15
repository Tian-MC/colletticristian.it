export type Locale = "it" | "en";

// **grassetto**, _corsivo_, [testo](url), {email}
export type Rich = string;

export type SectionKey = "top" | "about" | "services" | "work" | "reviews" | "process" | "faq" | "contact";

export type ServiceArtKey = "presence" | "time" | "tools" | "advice" | "support";
export type ProjectKey = "mascari" | "ducato" | "vip" | "ensemble";

export type CaseKey = ProjectKey;

export type ServiceKey = "websites" | "software" | "support";

export type Service = {
  id: ServiceArtKey;
  title: string;
  lead: string;
  examples: string[];
  idealFor: string;
};

export type Project = {
  id: ProjectKey;
  name: string;
  kind: string;
  tag: string;
  what: string;
  highlight: string;
  previewLabel: string;
};

export type Review = {
  quote: string;
  name: string;
  role: string;
  project?: string;
  caseKey?: CaseKey;
};

export type PrivacyBlock = { title: string; content: (Rich | Rich[])[] };

export type Dictionary = {
  locale: Locale;
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogImageAlt: string;
    ogLocale: string;
    language: string;
  };
  ids: Record<SectionKey, string> & { main: string };
  ui: {
    skipLink: string;
    homeLabel: string;
    backHome: string;
    mainNav: string;
    footerNav: string;
    mobileNav: string;
    menuLabel: string;
    menuOpen: string;
    menuClose: string;
    menuText: string;
    closeText: string;
    menuPrompt: string;
    call: string;
    email: string;
    whatsappLabel: string;
    theme: { label: string; toDark: string; toLight: string };
    language: {
      label: string;
      current: string;
      switchTo: string;
    };
    navGroups: {
      explore: string;
      services: string;
      serviceLinks: Record<ServiceKey, { label: string; hint: string }>;
    };
  };
  contactInfo: {
    hours: string;
    responseNote: string;
    whatsappText: string;
  };
  cta: { primary: string; whatsapp: string };
  navigation: { key: Exclude<SectionKey, "top" | "faq" | "reviews">; label: string }[];
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    intro: Rich;
    secondary: string;
    reassurance: string[];
    noteBefore: string;
    noteAfter: string;
  };
  about: {
    eyebrow: string;
    title: string;
    paragraphs: [Rich, Rich];
    commitments: { value: string; label: string }[];
    portraitRole: string;
  };
  translator: {
    eyebrow: string;
    title: string;
    lead: string;
    pick: string;
    heard: string;
    plain: string;
    jargon: { term: string; plain: string }[];
  };
  services: {
    eyebrow: string;
    title: string;
    lead: string;
    examplesLabel: string;
    sidebarLabel: string;
    items: Service[];
  };
  work: {
    eyebrow: string;
    title: string;
    lead: string;
    labels: { what: string; highlight: string };
    visit: string;
    newTab: string;
    caseLink: string;
    projects: Project[];
  };
  reviews: {
    eyebrow: string;
    title: string;
    lead: string;
    prev: string;
    next: string;
    items: Review[];
  };
  approach: {
    processEyebrow: string;
    processTitle: string;
    steps: { title: string; text: string; detail: string }[];
  };
  faq: {
    eyebrow: string;
    title: string;
    leadBefore: string;
    leadAfter: string;
    items: { q: string; a: string }[];
  };
  contact: {
    eyebrow: string;
    title: string;
    whatsappHint: string;
    emailHint: string;
    phoneLabel: string;
    copy: string;
    copied: string;
    copyLabel: string;
    copiedLabel: string;
    weekendNote: string;
    form: {
      title: string;
      subtitle: string;
      nameLabel: string;
      namePlaceholder: string;
      contactLabel: string;
      contactPlaceholder: string;
      needsLegend: string;
      needs: string[];
      messageLabel: string;
      optional: string;
      messagePlaceholder: string;
      honeypot: string;
      nameError: string;
      contactError: string;
      privacyBefore: string;
      privacyLink: string;
      privacyAfter: string;
      submit: string;
      sending: string;
      error: string;
      limited: string;
      sentBefore: string;
      sentAfter: string;
      sentText: string;
      sentTextMail: string;
      another: string;
      mailSubject: string;
      mailLabels: { name: string; contact: string; needs: string };
    };
  };
  footer: {
    claim: Rich;
    tagline: string;
    navTitle: string;
    servicesTitle: string;
    contactTitle: string;
    made: string;
    backToTop: string;
    privacy: string;
    profiles: string;
    newTab: string;
  };
  privacy: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    intro: string;
    blocks: PrivacyBlock[];
    updated: string;
  };
  pages: {
    common: PagesCommon;
    services: Record<ServiceKey, ServicePage>;
    cases: Record<CaseKey, CaseStudy>;
  };
};

export type PageMeta = { title: string; description: string };

export type PagesCommon = {
  breadcrumbLabel: string;
  breadcrumbHome: string;
  seeWork: string;
  learnMore: string;
  processEyebrow: string;
  processTitle: string;
  faqEyebrow: string;
  faqTitle: string;
  relatedEyebrow: string;
  relatedTitle: string;
  otherServicesTitle: string;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaText: string;
  caseEyebrow: string;
  factsTitle: string;
  otherCasesTitle: string;
  reviewEyebrow: string;
};

export type ServicePage = {
  meta: PageMeta;
  nav: string;
  serviceType: string;
  eyebrow: string;
  title: string;
  lead: Rich;
  offer: { eyebrow: string; title: string; groups: { title?: string; items: { title: string; text: string }[] }[] };
  how: { eyebrow: string; title: string; items: { title: string; text: string }[] };
  audience: { title: string; items: string[] };
  relatedTitle?: string;
  review?: string;
  faq: { q: string; a: string }[];
};

export type CaseStudy = {
  meta: PageMeta;
  nav: string;
  eyebrow: string;
  title: string;
  lead: string;
  facts: { label: string; value: string }[];
  brief: { title: string; text: string };
  build: { eyebrow: string; title: string; items: { title: string; text: string }[] };
  highlights: { title: string; text: string }[];
  authored: boolean;
  review?: string;
};
