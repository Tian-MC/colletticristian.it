import { Fragment } from "react";
import { site } from "@/content/site";

const TOKEN = /(\[[^\]]+\]\([^)\s]+\)|\*\*[^*]+\*\*|_[^_]+_|\{email\})/;
const LINK = /^\[([^\]]+)\]\(([^)\s]+)\)$/;

type RichProps = {
  text: string;
  strong?: string;
  em?: string;
  link?: string;
};

export function Rich({ text, strong, em, link }: RichProps) {
  return text.split(TOKEN).map((part, i) => {
    if (i % 2 === 0) return part ? <Fragment key={i}>{part}</Fragment> : null;
    if (part === "{email}") {
      return (
        <a key={i} href={`mailto:${site.email}`} className={link}>
          {site.email}
        </a>
      );
    }
    if (part.startsWith("**")) {
      return (
        <span key={i} className={strong}>
          {part.slice(2, -2)}
        </span>
      );
    }
    if (part.startsWith("_")) {
      return (
        <em key={i} className={em}>
          {part.slice(1, -1)}
        </em>
      );
    }
    const [, label, href] = part.match(LINK) ?? [];
    const external = /^https?:/.test(href);
    return (
      <a key={i} href={href} className={link} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {label}
      </a>
    );
  });
}
