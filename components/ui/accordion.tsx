"use client"

import * as React from "react"
import { cn } from "cn"
import { Accordion as AccordionPrimitive } from "radix-ui"

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-line first:border-t", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger flex flex-1 items-center justify-between gap-6 rounded-none py-6 text-left font-display text-xl leading-snug text-ink transition-colors duration-300 hover:text-violet focus-visible:text-violet md:py-7 md:text-[1.6rem] disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <span
          aria-hidden
          className="relative grid size-10 shrink-0 place-items-center rounded-full border border-line text-ink transition-[background-color,border-color,color,rotate] duration-500 ease-silk group-hover/accordion-trigger:border-violet/50 group-aria-expanded/accordion-trigger:rotate-180 group-aria-expanded/accordion-trigger:border-transparent group-aria-expanded/accordion-trigger:bg-cta group-aria-expanded/accordion-trigger:text-on-cta"
        >
          <span className="absolute h-px w-3.5 bg-current" />
          <span className="absolute h-3.5 w-px bg-current transition-transform duration-500 ease-silk group-aria-expanded/accordion-trigger:scale-y-0" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div className={cn("max-w-2xl pr-14 pb-7 text-[1.05rem] leading-relaxed text-ink-soft", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
