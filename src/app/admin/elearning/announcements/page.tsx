import { StaffAnnouncementForm } from "@/components/elearning/staff-announcement-form";
import { StatusBadge } from "@/components/platform/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { getStaffAnnouncementRecords } from "@/lib/platform/staff-records";

export const dynamic = "force-dynamic";

export default async function AdminElearningAnnouncementsPage() {
  const records = await getStaffAnnouncementRecords();

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            Announcement management
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Publish platform or course-level updates for learners, instructors, and admins.
          </p>
        </CardContent>
      </Card>

      <StaffAnnouncementForm courses={records.courses} />

      <div className="grid gap-4">
        {records.announcements.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {item.scope.toLowerCase()} {item.courseTitle ? `- ${item.courseTitle}` : ""}
                </p>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
                  {item.body}
                </p>
              </div>
              <StatusBadge value={item.status} tone={item.status === "PUBLISHED" ? "success" : "warning"} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
