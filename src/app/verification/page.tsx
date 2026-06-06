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

      <section className="section-padding pt-0">
        <div className="container-width">
          <h2 className="font-heading text-3xl font-bold text-[var(--color-ink)]">How verification works</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Locate the reference",
                detail: "Find the unique certificate number or document token printed on the official record.",
              },
              {
                step: "02",
                title: "Run the lookup",
                detail: "Enter the code above to instantly confirm status, programme, award, and completion date.",
              },
              {
                step: "03",
                title: "Confirm with confidence",
                detail: "Employers and institutions can trust a verified match — or contact us if a record needs review.",
              },
            ].map((item) => (
              <Card key={item.step}>
                <CardContent>
                  <p className="font-heading text-3xl font-bold text-[#eab308]">{item.step}</p>
                  <h3 className="font-heading mt-4 text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{item.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6 bg-[var(--color-ink)] text-white">
            <CardContent>
              <h3 className="font-heading text-2xl font-bold">For employers &amp; institutions</h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/72">
                Every Ruguna award carries a unique, checkable reference. If you are verifying a
                candidate in bulk or cannot locate a record, contact admissions and our team will
                confirm authenticity directly.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
