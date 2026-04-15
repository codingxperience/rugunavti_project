import { Download } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { learnerDownloads } from "@/data";

export default function LearnDownloadsPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            Downloads and learning resources
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Review your lesson files, worksheets, templates, and support documents in one place.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {learnerDownloads.map((resource) => (
          <Card key={resource.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                  {resource.label}
                </h2>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {resource.courseTitle} • {resource.lessonTitle}
                </p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {resource.type} • {resource.size}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-soft-accent)]">
                <Download className="h-5 w-5 text-[var(--color-ink)]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
