import { StatusBadge } from "@/components/platform/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminUsers } from "@/lib/platform/staff-records";

export const dynamic = "force-dynamic";

export default async function AdminElearningUsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            User management
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Review learner, instructor, and admin accounts attached to the eLearning product.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                  {user.name}
                </h2>
                <p className="mt-2 text-sm text-[var(--color-muted)]">{user.email}</p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {user.enrollmentCount} enrollments - {user.submissionCount} submissions
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.roles.map((role) => (
                  <StatusBadge key={role} value={role} />
                ))}
                <StatusBadge value={user.isActive ? "Active" : "Inactive"} tone={user.isActive ? "success" : "warning"} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
