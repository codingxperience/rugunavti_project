import { Card, CardContent } from "@/components/ui/card";
import { adminElearningSettings } from "@/data";

export default function AdminElearningSettingsPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            eLearning settings
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Review the current route, contact, and certificate settings that shape the learner experience.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {adminElearningSettings.map((item) => (
          <Card key={item.label}>
            <CardContent>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                {item.label}
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-ink)]">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
