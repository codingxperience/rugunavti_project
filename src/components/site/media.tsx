import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Full-bleed image band with a dark gradient overlay and overlaid content.
 * Used to break up text-heavy interior pages with a cinematic visual moment.
 */
export function MediaBand({
  image,
  alt,
  eyebrow,
  title,
  description,
  children,
  align = "left",
}: {
  image: string;
  alt: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <section className="section-padding">
      <div className="container-width">
        <div className="relative isolate overflow-hidden rounded-[36px] px-6 py-14 text-white sm:px-12 sm:py-20">
          <Image
            src={image}
            alt={alt}
            fill
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="-z-20 object-cover"
          />
          <div
            aria-hidden
            className={`absolute inset-0 -z-10 ${
              align === "center"
                ? "bg-gradient-to-b from-[var(--color-ink)]/55 to-[var(--color-ink)]/80"
                : "bg-gradient-to-r from-[var(--color-ink)]/90 via-[var(--color-ink)]/70 to-[var(--color-ink)]/25"
            }`}
          />
          <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
            {eyebrow ? (
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="font-heading mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h2>
            {description ? (
              <p className="mt-4 text-base leading-7 text-white/80">{description}</p>
            ) : null}
            {children ? <div className="mt-8">{children}</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Editorial two-column split: a framed image beside a content block.
 */
export function ImageSplit({
  image,
  alt,
  reverse = false,
  children,
}: {
  image: string;
  alt: string;
  reverse?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="section-padding">
      <div className="container-width grid items-center gap-10 lg:grid-cols-2">
        <div
          className={`relative aspect-[4/3] overflow-hidden rounded-[32px] border border-[var(--color-border)] shadow-[0_40px_90px_-60px_rgba(17,17,17,0.6)] ${
            reverse ? "lg:order-2" : ""
          }`}
        >
          <Image
            src={image}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className={reverse ? "lg:order-1" : ""}>{children}</div>
      </div>
    </section>
  );
}

/**
 * Captioned image gallery grid.
 */
export function Gallery({
  items,
}: {
  items: { image: string; caption: string }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <figure
          key={item.image}
          className="group relative aspect-[4/3] overflow-hidden rounded-[28px] border border-[var(--color-border)]"
        >
          <Image
            src={item.image}
            alt={item.caption}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/70 via-transparent to-transparent"
          />
          <figcaption className="absolute bottom-4 left-4 right-4 text-sm font-semibold text-white">
            {item.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
