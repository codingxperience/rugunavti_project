import Link from "next/link";

import { StaffCourseForm } from "@/components/elearning/staff-course-form";
import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getStaffCourseManagementRecords } from "@/lib/platform/staff-records";

export const dynamic = "force-dynamic";

export default async function AdminElearningCoursesPage() {
  const records = await getStaffCourseManagementRecords();

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            Course management
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Create course catalog entries, publish eLearning delivery, and open the builder for
            modules, lessons, resources, assignments, and quizzes.
          </p>
        </CardContent>
      </Card>

      <StaffCourseForm schools={records.schools} programs={records.programs} />

      <div className="grid gap-4">
        {records.courses.map((course) => (
          <Card key={course.id}>
            <CardContent>
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-center">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge value={course.programLevel.replace(/_/g, " ")} />
                    <StatusBadge value={course.status} tone={course.status === "PUBLISHED" ? "success" : "warning"} />
                  </div>
                  <h2 className="font-heading mt-4 text-2xl font-bold text-[var(--color-ink)]">
                    {course.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                    {course.schoolName} - {course.deliveryMode.replace(/_/g, " ")} - {course.enrollmentCount} learners
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                    {course.moduleCount} modules, {course.lessonCount} lessons. Owner: {course.ownerName}.
                  </p>
                </div>
                <div className="flex justify-start xl:justify-end">
                  <Button asChild>
                    <Link href={`/admin/elearning/courses/${course.id}/builder`}>Open builder</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
