import Link from "next/link";

import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/platform/session";
import { getStaffCourseManagementRecords } from "@/lib/platform/staff-records";

export const dynamic = "force-dynamic";

export default async function InstructorCoursesPage() {
  const session = await requireRole(["instructor", "super_admin"], "/instructor/courses");
  const records = await getStaffCourseManagementRecords(session);

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

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {records.courses.map((course) => (
          <Card key={course.id} className="overflow-hidden border-black/8 bg-white">
            <div
              className="min-h-32 bg-cover bg-center p-5 text-white"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(17,17,17,0.84), rgba(17,17,17,0.16)), url(${course.thumbnailUrl || "/brand/hero_illustration.jpg"})`,
              }}
            >
              <StatusBadge value={course.deliveryMode.replace(/_/g, " ")} />
              <h2 className="font-heading mt-10 text-2xl font-bold leading-tight">{course.title}</h2>
            </div>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <StatusBadge value={course.status} tone={course.status === "PUBLISHED" ? "success" : "warning"} />
                <StatusBadge value={`${course.enrollmentCount} learners`} />
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                {course.weekCount || 14} planned week(s), {course.moduleCount} modules, {course.lessonCount} lessons.
              </p>
              <div className="mt-5">
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
