import Link from "next/link";
import { ArrowRight, Clock3, Layers3, MonitorPlay } from "lucide-react";

import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ElearningCourse } from "@/data";

type CourseCardProps = {
  course: ElearningCourse;
  compact?: boolean;
};

export function CourseCard({ course, compact = false }: CourseCardProps) {
  return (
    <Card className="h-full border-black/6 bg-white shadow-[0_24px_80px_-64px_rgba(17,17,17,0.55)]">
      <CardContent className="flex h-full flex-col gap-5">
        <div
          className={`rounded-[28px] bg-gradient-to-br p-5 ${course.coverTone}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-72">
                {course.category}
              </p>
              <p className="font-heading mt-3 text-2xl font-bold leading-tight">
                {course.coverLabel}
              </p>
            </div>
            <StatusBadge value={course.mode} />
          </div>
          <p className="mt-8 text-sm leading-6 opacity-80">{course.school}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge value={course.level} />
          <StatusBadge value={course.enrollmentStatus} tone="success" />
        </div>

        <div>
          <h3 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
            {course.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            {course.summary}
          </p>
        </div>

        <div className="grid gap-3 text-sm text-[var(--color-muted)] sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-[var(--color-ink)]" />
            {course.duration}
          </div>
          <div className="flex items-center gap-2">
            <Layers3 className="h-4 w-4 text-[var(--color-ink)]" />
            {course.skillArea}
          </div>
          <div className="flex items-center gap-2">
            <MonitorPlay className="h-4 w-4 text-[var(--color-ink)]" />
            {course.startWindow}
          </div>
        </div>

        {!compact ? (
          <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
              What you will learn
            </p>
            <div className="mt-3 grid gap-2">
              {course.whatYouWillLearn.slice(0, 3).map((item) => (
                <p key={item} className="text-sm leading-7 text-[var(--color-muted)]">
                  {item}
                </p>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-3">
          <Button asChild>
            <Link href={`/elearning/courses/${course.slug}`}>
              View course
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/elearning/login">Start learning</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
