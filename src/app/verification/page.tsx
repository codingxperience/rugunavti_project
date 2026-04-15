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
        title="Verify certificates and completion records using a unique Ruguna reference"
        description="Every issued certificate or official completion record can be checked against a unique reference code to confirm status, programme, and award."
        aside={
          <div className="grid gap-3 text-sm text-[var(--color-muted)]">
            <p className="font-heading text-3xl font-bold text-[var(--color-ink)]">Live lookup</p>
            <p>Use a certificate code or official reference exactly as provided on the document.</p>
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
                Sample code: <span className="font-semibold text-[var(--color-ink)]">RUG-CERT-2025-1142</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              {match ? (
                <div className="grid gap-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Verification status</p>
                  <h2 className="font-heading text-3xl font-bold text-[var(--color-ink)]">{match.status}</h2>
                  <div className="grid gap-2 text-sm leading-7 text-[var(--color-muted)]">
                    <p>Student: {match.studentName}</p>
                    <p>Programme: {match.program}</p>
                    <p>Award: {match.award}</p>
                    <p>Date: {match.completionDate}</p>
                    <p>Code: {match.code}</p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Verification result</p>
                  <h2 className="font-heading text-3xl font-bold text-[var(--color-ink)]">No verified match found</h2>
                  <p className="text-sm leading-7 text-[var(--color-muted)]">
                    Recheck the code or contact admissions if you need support confirming a certificate or completion record.
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
