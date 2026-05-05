import { CertificateStatus } from "@prisma/client";

import { StatusBadge } from "@/components/platform/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { getRegistrarWorkspaceRecords } from "@/lib/platform/registrar-records";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-UG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Kampala",
  }).format(new Date(value));
}

export default async function RegistrarRecordsPage() {
  const records = await getRegistrarWorkspaceRecords();

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            Academic records
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Certificate and verification records available to the registrar desk.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {records.certificates.length ? (
          records.certificates.map((certificate) => (
            <Card key={certificate.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    {certificate.reference}
                  </p>
                  <h2 className="font-heading mt-2 text-2xl font-bold text-[var(--color-ink)]">
                    {certificate.learner}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    {certificate.program} | {certificate.course}
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    Verification: {certificate.verificationCode} | Issued {formatDate(certificate.issuedAt)}
                  </p>
                </div>
                <StatusBadge
                  value={certificate.status}
                  tone={certificate.statusValue === CertificateStatus.ISSUED ? "success" : "warning"}
                />
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                No certificate records yet
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Issued certificates and verification records will appear here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
