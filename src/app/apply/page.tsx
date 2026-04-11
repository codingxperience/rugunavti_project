import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileCheck2, Upload, WalletCards } from "lucide-react";
import type { ReactNode } from "react";

import { CtaBanner } from "@/components/site/cta-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  admissionRequirements,
  applyTracks,
  intakeMoments,
  portalHighlights,
  siteConfig,
} from "@/data";

export default function ApplyPage() {
  return (
    <>
      <section className="section-padding pb-10 pt-0">
        <div className="container-width overflow-hidden rounded-[38px] border border-black/6 bg-[var(--color-ink)] text-white shadow-[0_40px_100px_-62px_rgba(17,17,17,0.95)]">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/52">
                <Link href="/" className="transition hover:text-[var(--color-accent)]">
                  Home
                </Link>
                <span>/</span>
                <span>Apply online</span>
              </div>
              <p className="mt-8 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                Apply Online
              </p>
              <h1 className="font-heading mt-4 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Start your Ruguna application with a guided, mobile-friendly process
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                The reference showed a strong official application flow. For Ruguna, that becomes a
                cleaner digital application shell with pathway choices, support notes, and document
                readiness built in.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="#application-shell">
                    Begin application preview
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="border-white/12 bg-white/8 text-white hover:bg-white/12 hover:text-white"
                >
                  <Link href={siteConfig.prospectusHref}>Download prospectus</Link>
                </Button>
              </div>
            </div>

            <div className="relative flex items-end bg-[radial-gradient(circle_at_top,rgba(253,224,71,0.18),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 sm:p-8">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(17,17,17,0.4))]" />
              <div className="relative z-10 grid gap-4">
                <div className="w-full max-w-[240px] rounded-[30px] border border-white/12 bg-white/6 p-4 backdrop-blur">
                  <Image
                    src="/brand/hero-illustration.jpg"
                    alt="Ruguna applicant illustration"
                    width={1024}
                    height={1024}
                    className="aspect-square w-full rounded-[24px] object-cover"
                  />
                </div>
                <div className="rounded-[28px] border border-white/12 bg-white/6 p-5 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/52">Current intake rhythm</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {intakeMoments.map((month) => (
                      <span
                        key={month}
                        className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-white"
                      >
                        {month}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-width flex flex-wrap gap-3">
          {applyTracks.map((track, index) => (
            <div
              key={track.label}
              className={`rounded-full px-5 py-4 text-sm font-semibold ${
                index === 0
                  ? "bg-[var(--color-ink)] text-white"
                  : "border border-[var(--color-border)] bg-white text-[var(--color-ink)]"
              }`}
            >
              {track.label}
            </div>
          ))}
        </div>
      </section>

      <section id="application-shell" className="section-padding pt-0">
        <div className="container-width">
          <div className="rounded-[38px] border border-[var(--color-border)] bg-[#eef0ea] p-4 shadow-[0_34px_90px_-60px_rgba(17,17,17,0.85)] sm:p-6 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="grid gap-6">
                <section className="rounded-[30px] bg-white p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                        Section 01
                      </p>
                      <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-ink)]">
                        Personal details
                      </h2>
                    </div>
                    <span className="rounded-full bg-[var(--color-soft-accent)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink)]">
                      Applicant info
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <Field label="Full name">
                      <Input placeholder="Enter full name" />
                    </Field>
                    <Field label="Email address">
                      <Input placeholder="name@example.com" type="email" />
                    </Field>
                    <Field label="WhatsApp number">
                      <Input placeholder="+256..." />
                    </Field>
                    <Field label="Alternative phone number">
                      <Input placeholder="+256..." />
                    </Field>
                    <Field label="Nationality">
                      <ApplicationSelect
                        defaultValue=""
                        options={["Ugandan", "Kenyan", "Tanzanian", "Rwandan", "Other"]}
                        placeholder="Select nationality"
                      />
                    </Field>
                    <Field label="Do you have a disability?">
                      <ApplicationSelect
                        defaultValue=""
                        options={["No", "Yes"]}
                        placeholder="Select an option"
                      />
                    </Field>
                  </div>
                </section>

                <section className="rounded-[30px] bg-white p-5 sm:p-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                      Section 02
                    </p>
                    <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-ink)]">
                      Study choice
                    </h2>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <Field label="Preferred award level">
                      <ApplicationSelect
                        defaultValue=""
                        options={["Certificate", "Diploma", "Bachelor's", "Short Course"]}
                        placeholder="Select award level"
                      />
                    </Field>
                    <Field label="Preferred intake">
                      <ApplicationSelect
                        defaultValue=""
                        options={[...intakeMoments]}
                        placeholder="Select intake"
                      />
                    </Field>
                    <Field label="First programme choice" className="md:col-span-2">
                      <ApplicationSelect
                        defaultValue=""
                        options={[
                          "Diploma in Software Engineering",
                          "Diploma in Public Health Practice",
                          "Certificate in Solar PV Installation",
                          "Certificate in ICT Support & Networking",
                        ]}
                        placeholder="Select programme"
                      />
                    </Field>
                    <Field label="Second programme choice" className="md:col-span-2">
                      <ApplicationSelect
                        defaultValue=""
                        options={[
                          "Diploma in Construction Site Management",
                          "Diploma in Business Operations",
                          "Certificate in Entrepreneurship Practice",
                          "Short Course in AI for Digital Work",
                        ]}
                        placeholder="Optional alternative choice"
                      />
                    </Field>
                    <Field label="Preferred mode of study">
                      <ApplicationSelect
                        defaultValue=""
                        options={["Day", "Evening", "Weekend", "Blended", "Online"]}
                        placeholder="Select study mode"
                      />
                    </Field>
                    <Field label="Tell admissions about your goals">
                      <Textarea
                        className="min-h-24"
                        placeholder="Share your career goals, preferred school, or any context that would help the admissions team guide you."
                      />
                    </Field>
                  </div>
                </section>

                <section className="rounded-[30px] bg-white p-5 sm:p-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                      Section 03
                    </p>
                    <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-ink)]">
                      Education and document readiness
                    </h2>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <Field label="Previous school or institution" className="md:col-span-2">
                      <Input placeholder="State your most recent school or institution" />
                    </Field>
                    <Field label="Highest qualification">
                      <ApplicationSelect
                        defaultValue=""
                        options={[
                          "UCE",
                          "UACE",
                          "Certificate",
                          "Diploma",
                          "Bachelor's",
                        ]}
                        placeholder="Select qualification"
                      />
                    </Field>
                    <Field label="Year completed">
                      <Input placeholder="YYYY" />
                    </Field>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <UploadTile
                      title="Academic documents"
                      description="Certified copies of transcripts, result slips, or relevant certificates."
                    />
                    <UploadTile
                      title="National ID or passport"
                      description="A valid identification document ready for upload from phone or desktop."
                    />
                  </div>
                </section>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button size="lg">Submit Application Interest</Button>
                  <Button asChild size="lg" variant="secondary">
                    <Link href="/admissions">Review Admissions Steps</Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                <Card className="bg-[var(--color-ink)] text-white">
                  <CardContent>
                    <p className="text-xs uppercase tracking-[0.22em] text-white/56">Ready before you begin</p>
                    <div className="mt-5 grid gap-4">
                      {portalHighlights.applicant.map((item) => (
                        <div key={item} className="rounded-[22px] border border-white/10 bg-white/6 p-4">
                          <p className="text-sm font-medium text-white">{item}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <FileCheck2 className="h-5 w-5 text-[var(--color-ink)]" />
                      <h3 className="font-heading text-xl font-bold text-[var(--color-ink)]">
                        Documents checklist
                      </h3>
                    </div>
                    <ul className="mt-5 grid gap-3 text-sm leading-7 text-[var(--color-muted)]">
                      {admissionRequirements.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <WalletCards className="h-5 w-5 text-[var(--color-ink)]" />
                      <h3 className="font-heading text-xl font-bold text-[var(--color-ink)]">
                        Fees and support
                      </h3>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                      Final application fees, installment policy notes, and finance guidance can plug
                      directly into this experience once the backend is connected.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Upload className="h-5 w-5 text-[var(--color-ink)]" />
                      <h3 className="font-heading text-xl font-bold text-[var(--color-ink)]">
                        Need help uploading from your phone?
                      </h3>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                      Use WhatsApp or the contact page to get help if your scans or photos need resizing,
                      compressing, or confirmation before submission.
                    </p>
                    <Link
                      href="/contact"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)]"
                    >
                      Contact admissions support
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        title="Ready to move from this guided shell into a live admissions workflow?"
        description="The next implementation phase can connect Clerk auth, database-backed applications, uploads, payment guidance, and status tracking to this structure."
        primaryLabel="View Admissions"
        primaryHref="/admissions"
        secondaryLabel="Explore Programs"
        secondaryHref="/programs"
      />
    </>
  );
}

type FieldProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

function Field({ label, children, className }: FieldProps) {
  return (
    <label className={`grid gap-2 text-sm font-medium text-[var(--color-ink)] ${className ?? ""}`}>
      {label}
      {children}
    </label>
  );
}

type ApplicationSelectProps = {
  defaultValue?: string;
  placeholder: string;
  options: readonly string[];
};

function ApplicationSelect({
  defaultValue = "",
  placeholder,
  options,
}: ApplicationSelectProps) {
  return (
    <select
      defaultValue={defaultValue}
      className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-ink)]/25 focus:ring-4 focus:ring-[var(--color-soft-accent)]"
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

type UploadTileProps = {
  title: string;
  description: string;
};

function UploadTile({ title, description }: UploadTileProps) {
  return (
    <div className="rounded-[26px] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
        <Upload className="h-5 w-5 text-[var(--color-ink)]" />
      </div>
      <h3 className="font-heading mt-5 text-xl font-bold text-[var(--color-ink)]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{description}</p>
    </div>
  );
}
