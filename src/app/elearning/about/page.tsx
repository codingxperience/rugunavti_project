import { Card, CardContent } from "@/components/ui/card";
import { elearningBenefits, elearningSteps } from "@/data";

const deliveryPoints = [
  "Lessons are delivered in structured sequences with progress-aware navigation and clear next actions.",
  "Video, text, downloads, practical instructions, quizzes, and assignments are combined based on the course design.",
  "Working learners can study in smaller sessions and continue from where they stopped.",
  "Blended courses clearly separate online theory from in-person lab or practical attendance expectations.",
];

const standards = [
  "Readable layouts for mobile and low-bandwidth study",
  "Clear progress, announcement, and certificate states",
  "Protected learner access and role-aware routing",
  "Support-friendly contact channels for first-time digital learners",
];

export default function ElearningAboutPage() {
  return (
    <section className="section-padding pt-10 sm:pt-14">
      <div className="container-width grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-6">
          <Card>
            <CardContent>
              <span className="eyebrow">About Ruguna eLearning</span>
              <h1 className="font-heading mt-5 text-5xl font-bold text-[var(--color-ink)]">
                A practical digital learning extension of the Ruguna institution
              </h1>
              <p className="mt-5 max-w-4xl text-base leading-8 text-[var(--color-muted)]">
                Ruguna eLearning is designed for short courses, online certificate
                pathways, blended support modules, and professional upskilling. It
                serves school leavers, working adults, career switchers, and learners
                who need structured study without losing flexibility.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
                How learning is delivered
              </h2>
              <div className="mt-6 grid gap-3">
                {deliveryPoints.map((item) => (
                  <div
                    key={item}
                    className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5 text-sm leading-7 text-[var(--color-muted)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
                Ruguna online learning standards
              </h2>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {standards.map((item) => (
                  <div
                    key={item}
                    className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5 text-sm leading-7 text-[var(--color-muted)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4">
          <Card className="bg-[var(--color-ink)] text-white">
            <CardContent>
              <h2 className="font-heading text-3xl font-bold">Who it is for</h2>
              <div className="mt-5 grid gap-3 text-sm leading-7 text-white/74">
                <p>School leavers building employable digital skills.</p>
                <p>Working adults who need flexible evening or self-paced study.</p>
                <p>Parents and guardians checking legitimacy and progression.</p>
                <p>Professionals taking short courses to improve job readiness.</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                Benefits for working learners
              </h2>
              <div className="mt-5 grid gap-3">
                {elearningBenefits.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4"
                  >
                    <p className="font-semibold text-[var(--color-ink)]">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                Learning sequence
              </h2>
              <div className="mt-5 grid gap-3">
                {elearningSteps.map((item) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 text-sm leading-7 text-[var(--color-muted)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
