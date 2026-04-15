import { StatusBadge } from "@/components/platform/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { adminElearningAnnouncements } from "@/data";

export default function AdminElearningAnnouncementsPage() {
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

      <div className="grid gap-4">
        {adminElearningAnnouncements.map((item) => (
          <Card key={item.title}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm text-[var(--color-muted)]">{item.audience}</p>
              </div>
              <StatusBadge value={item.status} tone={item.status === "Live" ? "success" : "warning"} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
