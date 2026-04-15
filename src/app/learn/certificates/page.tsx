import Link from "next/link";

import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { demoStudentCourses } from "@/data";

export default function LearnCertificatesPage() {
  const certificates = demoStudentCourses.filter((course) => course.certificateCode);

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
        {certificates.map((course) => (
          <Card key={course.slug}>
            <CardContent className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="font-heading text-2xl font-bold text-[var(--color-ink)]">{course.title}</p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  Verification code: {course.certificateCode}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <StatusBadge value="Issued" tone="success" />
                <Button asChild variant="secondary">
                  <Link href={`/verification?code=${course.certificateCode}`}>Verify</Link>
                </Button>
                <Button>Download certificate</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
