import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="section-padding">
      <div className="container-width max-w-3xl rounded-[32px] border border-[var(--color-border)] bg-white/90 p-8 shadow-[0_28px_90px_-64px_rgba(17,17,17,0.85)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
          Not found
        </p>
        <h1 className="font-heading mt-4 text-3xl font-bold text-[var(--color-ink)]">
          The page or record you requested is not available
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
          Return to the homepage, browse programmes, or open the eLearning login page to continue.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/programs">Browse programmes</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
