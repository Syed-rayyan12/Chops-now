import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none  aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        menuMain:"bg-secondary text-white w-full rounded-md",
        menuMain2:"border border-secondary text-foreground rounded-md",

        pdf:"hover:bg-white hover:text-secondary",
        edit:"bg-none hover:bg-none text-primary",
        delete:"bg-none hover:bg-none text-secondary",
        btx:"bg-white rounded-full w-12 h-12",
        new:
        "bg-transparent border border-primary",
        new2:
        "hover:bg-transparent bg-primary border border-transparent hover:text-primary border hover:border-primary",
        my:
        "bg-background text-foreground hover:bg-none",
        mys:
        " text-foreground hover:bg-none",
         part1:
        " bg-secondary text-white rounded-lg px-7 py-5 text-[15px]",
          part2:
          " bg-white text-secondary rounded-lg px-7 py-5 text-[15px]",
        mak:
        "border border-secondary/50 hover:bg-secondary hover:border-none hover:text-white",

        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-secondary/40 bg-white shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-white shadow-xs hover:bg-secondary/80",
        tertiary:
        "bg-none text-foreground hover:bg-white hover:text-white dark:hover:bg-accent/50",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
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
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
