import { Card, CardContent } from "@/components/ui/card";
import { learnerProfile } from "@/data";

export default function LearnProfilePage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            Learner profile
          </h1>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              { label: "Full name", value: learnerProfile.name },
              { label: "Email", value: learnerProfile.email },
              { label: "Phone", value: learnerProfile.phone },
              { label: "Location", value: learnerProfile.location },
              { label: "Preferred device", value: learnerProfile.preferredDevice },
              { label: "Support preference", value: learnerProfile.supportPreference },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  {item.label}
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-ink)]">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <Card className="bg-[var(--color-ink)] text-white">
          <CardContent>
            <h2 className="font-heading text-2xl font-bold">Current goal</h2>
            <p className="mt-4 text-sm leading-7 text-white/74">{learnerProfile.currentGoal}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
              Account guidance
            </h2>
            <div className="mt-4 grid gap-3 text-sm leading-7 text-[var(--color-muted)]">
              <p>Keep your email address active for verification and academic notices.</p>
              <p>Update phone details if you rely on WhatsApp support or SMS reminders.</p>
              <p>Use the password reset route if you lose access to your account.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
