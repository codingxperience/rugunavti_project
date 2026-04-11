import Link from "next/link";

import { Button } from "@/components/ui/button";

type CtaBannerProps = {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function CtaBanner({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: CtaBannerProps) {
  return (
    <section className="section-padding pt-10">
      <div className="container-width accent-panel overflow-hidden rounded-[36px] px-6 py-10 text-white shadow-[0_36px_90px_-54px_rgba(17,17,17,0.95)] sm:px-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <p className="eyebrow border-white/10 bg-white/6 text-white/72">Take the next step</p>
            <h2 className="font-heading mt-5 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
              {description}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button asChild size="lg">
              <Link href={primaryHref}>{primaryLabel}</Link>
            </Button>
            {secondaryLabel && secondaryHref ? (
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="border-white/12 bg-white/6 text-white hover:bg-white/12 hover:text-white"
              >
                <Link href={secondaryHref}>{secondaryLabel}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
