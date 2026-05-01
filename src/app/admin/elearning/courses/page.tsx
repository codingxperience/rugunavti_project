import Link from "next/link";

import { StaffCourseForm } from "@/components/elearning/staff-course-form";
import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/platform/session";
import { getStaffCourseManagementRecords } from "@/lib/platform/staff-records";

export const dynamic = "force-dynamic";

export default async function AdminElearningCoursesPage() {
  const session = await requireRole(["registrar_admin", "super_admin"], "/admin/elearning/courses");
  const records = await getStaffCourseManagementRecords(session);

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

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {records.courses.map((course) => (
          <Card key={course.id} className="overflow-hidden border-black/8 bg-white">
            <div
              className="min-h-32 bg-cover bg-center p-5 text-white"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(17,17,17,0.84), rgba(17,17,17,0.16)), url(${course.thumbnailUrl || "/brand/hero_illustration.jpg"})`,
              }}
            >
              <StatusBadge value={course.programLevel.replace(/_/g, " ")} />
              <h2 className="font-heading mt-10 text-2xl font-bold leading-tight">{course.title}</h2>
            </div>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <StatusBadge value={course.deliveryMode.replace(/_/g, " ")} />
                <StatusBadge value={course.status} tone={course.status === "PUBLISHED" ? "success" : "warning"} />
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                {course.schoolName}. {course.enrollmentCount} learners, {course.weekCount || 14} planned week(s),
                {course.moduleCount} modules, {course.lessonCount} lessons.
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">Owner: {course.ownerName}.</p>
              <div className="mt-5">
                <Button asChild>
                  <Link href={`/admin/elearning/courses/${course.id}/builder`}>Open builder</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
