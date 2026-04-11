import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)]/20 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-accent)] px-5 py-3 text-[var(--color-ink)] shadow-[0_14px_30px_-18px_rgba(253,224,71,0.95)] hover:-translate-y-0.5 hover:bg-[#f7db34]",
        secondary:
          "border border-[var(--color-border)] bg-white px-5 py-3 text-[var(--color-ink)] hover:-translate-y-0.5 hover:border-[var(--color-ink)]/25 hover:bg-[var(--color-soft-accent)]",
        ghost:
          "px-4 py-2 text-[var(--color-ink)] hover:bg-[var(--color-soft-accent)]"
      },
      size: {
        default: "h-11",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}

export { Button, buttonVariants };
