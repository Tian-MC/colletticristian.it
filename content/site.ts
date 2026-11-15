import type { ProjectKey } from "./types";

const whatsappNumber = "393242517364";

export const site = {
  name: "Tian",
  url: "https://colletticristian.it",
  city: "Parma",
  region: "PR",
  email: "info@colletticristian.it",
  phoneDisplay: "+39 324 251 7364",
  phoneHref: "tel:+393242517364",
  whatsappDisplay: "+39 324 251 7364",
  formEndpoint: "/api/contact",
  profiles: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/cristian-colletti-0137b31b2/" },
    { label: "GitHub", href: "https://github.com/Tian-MC" },
  ],
  repo: "https://github.com/Tian-MC/colletticristian.it",
} as const;

export const projectDomains: Partial<Record<ProjectKey, string>> = {
  mascari: "mascariassicurazioni.it",
  ducato: "ducato-nerd.vercel.app",
  vip: "visualitalianproject.it",
};

export function whatsappHref(text: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}
