import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminUsers } from "@/lib/platform/staff-records";
import { requireRole } from "@/lib/platform/session";

import { updateUserRoleAction } from "./actions";

export const dynamic = "force-dynamic";

const roleOptions = [
  { value: "student", label: "Student" },
  { value: "instructor", label: "Instructor" },
  { value: "registrar_admin", label: "Registrar/Admin" },
  { value: "finance_admin", label: "Finance/Admin" },
  { value: "super_admin", label: "Super Admin" },
];

const statusMessages: Record<string, { title: string; tone: "success" | "warning" }> = {
  "role-updated": {
    title: "Role updated and synced to Clerk.",
    tone: "success",
  },
  "invalid-role": {
    title: "That role could not be applied.",
    tone: "warning",
  },
  "user-not-found": {
    title: "The selected user was not found.",
    tone: "warning",
  },
  "cannot-demote-self": {
    title: "You cannot remove your own super admin access.",
    tone: "warning",
  },
  "db-updated-clerk-sync-failed": {
    title: "Database role updated, but Clerk metadata sync failed. Try again.",
    tone: "warning",
  },
};

export default async function AdminElearningUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await requireRole(["registrar_admin", "super_admin"], "/admin/elearning/users");
  const [{ status }, users] = await Promise.all([
    searchParams,
    getAdminUsers(),
  ]);
  const canManageRoles = session.roles.includes("super_admin");
  const statusMessage = status ? statusMessages[status] : null;

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            User management
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Review learner, instructor, and admin accounts attached to the eLearning product.
            Super admins can promote users and sync their active role back to Clerk.
          </p>
        </CardContent>
      </Card>

      {statusMessage ? (
        <Card className={statusMessage.tone === "success" ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}>
          <CardContent>
            <p className={statusMessage.tone === "success" ? "text-sm font-semibold text-emerald-800" : "text-sm font-semibold text-amber-800"}>
              {statusMessage.title}
            </p>
          </CardContent>
        </Card>
      ) : null}

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
              {canManageRoles ? (
                <form action={updateUserRoleAction} className="flex flex-wrap items-center gap-3">
                  <input type="hidden" name="userId" value={user.id} />
                  <label className="sr-only" htmlFor={`role-${user.id}`}>
                    Assign role
                  </label>
                  <select
                    id={`role-${user.id}`}
                    name="role"
                    defaultValue={user.roleSlugs[0] ?? "student"}
                    className="h-11 rounded-full border border-[var(--color-border)] bg-white px-4 text-sm font-semibold text-[var(--color-ink)] outline-none transition focus:border-[var(--color-ink)]"
                  >
                    {roleOptions.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  <Button type="submit" size="sm">
                    Save role
                  </Button>
                </form>
              ) : (
                <p className="text-sm text-[var(--color-muted)]">
                  Super admin access is required to change roles.
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
