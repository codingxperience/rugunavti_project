import Link from "next/link";

import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getStaffCourseManagementRecords } from "@/lib/platform/staff-records";

export const dynamic = "force-dynamic";

export default async function InstructorCoursesPage() {
  const records = await getStaffCourseManagementRecords();

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            Assigned courses
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Open each course builder to manage modules, lessons, resources, quizzes, and assignments.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {records.courses.map((course) => (
          <Card key={course.id}>
            <CardContent className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge value={course.deliveryMode.replace(/_/g, " ")} />
                  <StatusBadge value={course.status} tone={course.status === "PUBLISHED" ? "success" : "warning"} />
                </div>
                <h2 className="font-heading mt-4 text-3xl font-bold text-[var(--color-ink)]">
                  {course.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  {course.enrollmentCount} learners - {course.moduleCount} modules - {course.lessonCount} lessons.
                </p>
              </div>
              <div className="flex justify-start xl:justify-end">
                <Button asChild>
                  <Link href={`/instructor/course/${course.id}/builder`}>Open builder</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
