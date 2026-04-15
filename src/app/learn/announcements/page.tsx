import { Card, CardContent } from "@/components/ui/card";
import { demoStudentCourses, studentAnnouncements } from "@/data";

export default function LearnAnnouncementsPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            Announcements
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Platform-wide updates and course-level learning notices are listed here for easy review.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-[var(--color-ink)] text-white">
        <CardContent>
          <h2 className="font-heading text-2xl font-bold">Platform notices</h2>
          <div className="mt-5 grid gap-3">
            {studentAnnouncements.map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-white/80"
              >
                {item}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {demoStudentCourses.map((course) => (
          <Card key={course.slug}>
            <CardContent>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                {course.title}
              </h2>
              <div className="mt-5 grid gap-3">
                {course.schedule.map((item) => (
                  <div
                    key={`${course.slug}-${item}`}
                    className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 text-sm leading-7 text-[var(--color-muted)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
