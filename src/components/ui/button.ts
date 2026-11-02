import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-normal text-center transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "min-h-9 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "min-h-11 px-6 py-2.5 has-[>svg]:px-4",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);
export type ButtonVariants = VariantProps<typeof buttonVariants>;
export function buttonClassName(options: ButtonVariants) {
  return cn(buttonVariants(options));
}
