import Link from "next/link";

import { LearnerSupportForm } from "@/components/elearning/learner-support-form";
import { Card, CardContent } from "@/components/ui/card";
import { learnerHelpChannels, supportCategories } from "@/data";

export default function LearnHelpPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            Learner support desk
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Use this route for login issues, assessment questions, certificate support, or general eLearning assistance.
          </p>
          <div className="mt-8">
            <LearnerSupportForm categories={supportCategories} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <Card className="bg-[var(--color-ink)] text-white">
          <CardContent>
            <h2 className="font-heading text-2xl font-bold">Support channels</h2>
            <div className="mt-5 grid gap-3">
              {learnerHelpChannels.map((channel) => (
                <div
                  key={channel.title}
                  className="rounded-[22px] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-white/80"
                >
                  <p className="font-semibold text-white">{channel.title}</p>
                  <p className="mt-2">{channel.detail}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
              Quick actions
            </h2>
            <div className="mt-5 grid gap-3 text-sm font-semibold text-[var(--color-ink)]">
              <Link href="/verification">Verification lookup</Link>
              <Link href="/learn/certificates">Certificates page</Link>
              <Link href="/elearning/contact">Admissions contact</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
