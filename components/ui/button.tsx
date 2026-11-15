import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "group/button relative isolate inline-flex shrink-0 items-center justify-center gap-2.5 overflow-hidden rounded-full font-medium whitespace-nowrap outline-none select-none transition-[background-color,color,box-shadow,border-color,transform] duration-300 ease-silk focus-visible:ring-[3px] focus-visible:ring-violet/45 focus-visible:ring-offset-2 focus-visible:ring-offset-paper focus-visible:outline-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-cta text-on-cta shadow-[inset_0_1px_0_rgb(255_255_255/0.22),0_12px_32px_-12px_var(--cta),0_2px_6px_-2px_var(--shadow-tint)] hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.28),0_20px_44px_-14px_var(--cta),0_2px_6px_-2px_var(--shadow-tint)] before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(120%_120%_at_50%_120%,var(--orchid),transparent_60%)] before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-60 after:pointer-events-none after:absolute after:inset-y-0 after:-left-1/2 after:w-1/3 after:-skew-x-12 after:bg-white/25 after:blur-md after:-translate-x-full after:transition-transform after:duration-700 after:ease-silk hover:after:translate-x-[420%]",
        outline:
          "border border-line bg-surface/60 text-ink backdrop-blur-sm hover:border-violet/45 hover:bg-surface",
        ghost: "text-ink hover:bg-violet-soft/70",
        night:
          "bg-white text-[oklch(0.3_0.14_292)] shadow-[0_18px_40px_-16px_rgb(0_0_0/0.6)] hover:bg-[oklch(0.97_0.02_300)]",
        "night-outline": "border border-white/25 text-white hover:border-white/50 hover:bg-white/10",
        secondary: "bg-violet-soft text-ink hover:bg-violet-soft/80",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
        link: "rounded-none text-violet underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 text-[0.95rem]",
        sm: "h-9 px-4 text-sm",
        lg: "h-14 px-7 text-base",
        icon: "size-11",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
