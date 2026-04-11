import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-ink)]/25 focus:ring-4 focus:ring-[var(--color-soft-accent)] placeholder:text-[var(--color-muted)]",
        className
      )}
      {...props}
    />
  );
}
