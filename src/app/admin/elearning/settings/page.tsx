import { Database, KeyRound, Link2, ShieldCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/platform/session";
import { getAdminElearningSettingsRecords } from "@/lib/platform/staff-records";

export const dynamic = "force-dynamic";

export default async function AdminElearningSettingsPage() {
  await requireRole(["registrar_admin", "super_admin"], "/admin/elearning/settings");
  const settings = await getAdminElearningSettingsRecords();

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            eLearning settings
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Clean view of the core routes, session policy, storage buckets, and learner-facing
            settings powering the platform.
          </p>
        </CardContent>
      </Card>

      <section className="grid gap-4 xl:grid-cols-3">
        {settings.cards.map((item, index) => {
          const Icon = [KeyRound, ShieldCheck, Database, ShieldCheck, Link2, ShieldCheck][index] ?? ShieldCheck;

          return (
            <Card key={item.label} className="border-black/8 bg-white shadow-none">
              <CardContent>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f6f5ef] text-[var(--color-ink)]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  {item.label}
                </p>
                <p className="mt-3 break-words text-base font-bold text-[var(--color-ink)]">
                  {item.value}
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{item.detail}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <Card>
        <CardContent>
          <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
            Stored setting records
          </h2>
          <div className="mt-5 grid gap-3">
            {settings.rawSettings.map((setting) => (
              <div
                key={setting.key}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4"
              >
                <div>
                  <p className="font-semibold text-[var(--color-ink)]">{setting.key}</p>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{setting.category}</p>
                </div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  {new Date(setting.updatedAt).toLocaleDateString("en-UG", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
