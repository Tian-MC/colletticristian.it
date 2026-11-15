"use client";

import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { useScrollTo } from "@/components/smooth-scroll";

type AnchorLinkProps = ComponentProps<"a"> & { href: string };

export function homeOf(pathname: string) {
  return pathname === "/en" || pathname.startsWith("/en/") ? "/en" : "/";
}

export function AnchorLink({ href, onClick, children, ...props }: AnchorLinkProps) {
  const scrollTo = useScrollTo();
  const pathname = usePathname();
  const home = homeOf(pathname);
  const onHome = pathname === home;
  const target = !onHome && href.startsWith("#") && href !== "#" ? `${home}${href}` : href;

  return (
    <a
      href={target}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || !target.startsWith("#")) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        scrollTo(target);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
