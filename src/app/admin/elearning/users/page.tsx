import { StatusBadge } from "@/components/platform/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { adminElearningUsers } from "@/data";

export default function AdminElearningUsersPage() {
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
        {adminElearningUsers.map((user) => (
          <Card key={`${user.name}-${user.role}`}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                  {user.name}
                </h2>
                <p className="mt-2 text-sm text-[var(--color-muted)]">{user.focus}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge value={user.role} />
                <StatusBadge value={user.status} tone="success" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
