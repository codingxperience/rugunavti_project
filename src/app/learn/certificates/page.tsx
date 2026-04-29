import Link from "next/link";

import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLearnerCertificates } from "@/lib/platform/learning-records";
import { requireRole } from "@/lib/platform/session";

export const dynamic = "force-dynamic";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-UG", {
    dateStyle: "medium",
  }).format(value);
}

export default async function LearnCertificatesPage() {
  const session = await requireRole(["student", "super_admin"], "/learn/certificates");
  const certificates = await getLearnerCertificates(session);

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            Certificates and completions
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Certificates are issued when course completion and assessment thresholds are satisfied.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {certificates.length ? (
          certificates.map((certificate) => (
            <Card key={certificate.id}>
              <CardContent className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                    {certificate.course?.title ?? certificate.program.title}
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    Reference: {certificate.reference}
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    Issued: {formatDate(certificate.issuedAt)}
                  </p>
                  {certificate.verification ? (
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                      Verification code: {certificate.verification.verificationCode}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-3">
                  <StatusBadge value={certificate.status} tone="success" />
                  {certificate.verification ? (
                    <Button asChild variant="secondary">
                      <Link href={`/verification?code=${certificate.verification.verificationCode}`}>
                        Verify
                      </Link>
                    </Button>
                  ) : null}
                  {certificate.certificateUrl ? (
                    <Button asChild>
                      <Link href={certificate.certificateUrl}>Download certificate</Link>
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                No certificates issued yet
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                Certificates will appear here when an authorized admin issues completion records
                for your eligible course enrollments.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
