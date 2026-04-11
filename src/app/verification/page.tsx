import { PageHero } from "@/components/site/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { verificationSamples } from "@/data";

export default async function VerificationPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const match = verificationSamples.find(
    (item) => item.code.toLowerCase() === code?.trim().toLowerCase()
  );

  return (
    <>
      <PageHero
        eyebrow="Verification"
        title="Verify certificate and admission authenticity with a simple lookup flow"
        description="The verification page is designed for privacy-aware document checking and can later connect to real certificate, admissions, and audit-log records."
        aside={
          <div className="grid gap-3 text-sm text-[var(--color-muted)]">
            <p className="font-heading text-3xl font-bold text-[var(--color-ink)]">Lookup-ready</p>
            <p>Search by certificate code, admission token, or student identifier when the backend goes live.</p>
          </div>
        }
      />

      <section className="section-padding pt-0">
        <div className="container-width grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
          <Card>
            <CardContent>
              <form className="grid gap-4">
                <label className="grid gap-2 text-sm font-medium text-[var(--color-ink)]">
                  Verification code
                  <Input
                    name="code"
                    defaultValue={code ?? ""}
                    placeholder="Enter certificate number or document token"
                  />
                </label>
                <Button type="submit" className="w-full sm:w-fit">
                  Verify document
                </Button>
              </form>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                Try sample code: <span className="font-semibold text-[var(--color-ink)]">RUG-CERT-2025-1142</span>
              </p>
            </CardContent>
          </Card>

          <Card className={match ? "border-[var(--color-ink)]/10" : ""}>
            <CardContent>
              {match ? (
                <div className="grid gap-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                    Verification status
                  </p>
                  <h2 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
                    {match.status}
                  </h2>
                  <div className="grid gap-2 text-sm leading-7 text-[var(--color-muted)]">
                    <p>Student: {match.studentName}</p>
                    <p>Program: {match.program}</p>
                    <p>Award: {match.award}</p>
                    <p>Date: {match.completionDate}</p>
                    <p>Code: {match.code}</p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                    Verification result
                  </p>
                  <h2 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
                    No matching record yet
                  </h2>
                  <p className="text-sm leading-7 text-[var(--color-muted)]">
                    Enter one of the sample codes above or connect this page to real certificate and admissions tables in the next backend phase.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
