import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "border border-primary/80 bg-primary text-primary-foreground shadow-sm hover:-translate-y-0.5 hover:bg-primary/92 hover:shadow-md",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-border bg-transparent text-foreground shadow-none hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/8 hover:text-foreground dark:border-border dark:bg-white/3 dark:hover:border-primary/55 dark:hover:bg-accent/20",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/88",
        ghost:
          "hover:bg-accent/12 hover:text-foreground dark:hover:bg-accent/18",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-9 gap-1.5 px-3.5 has-[>svg]:px-3",
        lg: "h-12 px-6 has-[>svg]:px-4.5",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>

export function buttonClassName(options: VariantProps<typeof buttonVariants>) {
  return cn(buttonVariants(options))
}
