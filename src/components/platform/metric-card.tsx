import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
  className?: string;
};

export function MetricCard({ label, value, detail, icon, className }: MetricCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="flex h-full flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
              {label}
            </p>
            <p className="font-heading mt-4 text-3xl font-bold text-[var(--color-ink)]">{value}</p>
          </div>
          {icon ? <div className="rounded-2xl bg-[var(--color-soft-accent)] p-3">{icon}</div> : null}
        </div>
        {detail ? <p className="text-sm leading-7 text-[var(--color-muted)]">{detail}</p> : null}
      </CardContent>
    </Card>
  );
}
