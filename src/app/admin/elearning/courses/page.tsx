import { StatusBadge } from "@/components/platform/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { elearningCourses } from "@/data";

export default function AdminElearningCoursesPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            Course management
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Review public catalog entries, delivery modes, featured status, and enrollment state.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {elearningCourses.map((course) => (
          <Card key={course.slug}>
            <CardContent>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                    {course.title}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    {course.school} • {course.mode} • {course.duration}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge value={course.level} />
                  <StatusBadge value={course.enrollmentStatus} tone="success" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
