import Link from "next/link";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLearnerDownloads } from "@/lib/platform/learning-records";
import { requireRole } from "@/lib/platform/session";

export const dynamic = "force-dynamic";

function formatBytes(value: number) {
  if (value < 1024 * 1024) {
    return `${Math.max(Math.round(value / 1024), 1)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function LearnDownloadsPage() {
  const session = await requireRole(["student", "super_admin"], "/learn/downloads");
  const resources = await getLearnerDownloads(session);

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            Downloads and learning resources
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Review lesson files, worksheets, templates, and support documents attached to your
            enrolled courses.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {resources.length ? (
          resources.map((resource) => (
            <Card key={resource.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                    {resource.title}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    {resource.lesson.module.course.title} - {resource.lesson.title}
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    {resource.mimeType} - {formatBytes(resource.sizeBytes)}
                  </p>
                </div>
                <Button asChild variant="secondary">
                  <Link href={`/api/elearning/resources/${resource.id}`}>
                    <Download className="h-4 w-4" />
                    Download
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                No resources are available
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                Enroll in a course with published lesson resources to see downloads here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
