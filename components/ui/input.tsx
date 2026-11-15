import * as React from "react"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-13 w-full min-w-0 rounded-2xl border border-line bg-paper/60 px-4 text-base text-ink transition-[border-color,box-shadow,background-color] duration-300 outline-none placeholder:text-ink-faint hover:border-violet/35 focus-visible:border-violet focus-visible:bg-surface focus-visible:ring-4 focus-visible:ring-violet/15 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/15",
        className
      )}
      {...props}
    />
  )
}

export { Input }
