import {
  Bell,
  BookOpenText,
  CalendarClock,
  CirclePlay,
  FileBadge2,
  LayoutDashboard,
  Search,
} from "lucide-react";

import { ProgressBar } from "@/components/platform/progress-bar";
import { StatusBadge } from "@/components/platform/status-badge";
import { demoStudentCourses, getRecommendedLesson } from "@/data";

const previewNav = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "My Courses", icon: BookOpenText },
  { label: "Announcements", icon: Bell },
  { label: "Certificates", icon: FileBadge2 },
];

export function DashboardPreview() {
  const primaryCourse = demoStudentCourses[0];
  const secondaryCourse = demoStudentCourses[1];
  const currentLesson = getRecommendedLesson(primaryCourse);

  return (
    <div className="overflow-hidden rounded-[36px] border border-black/6 bg-[#f7f6f0] shadow-[0_44px_130px_-86px_rgba(17,17,17,0.8)]">
      <div className="grid lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="border-b border-black/6 bg-[#efede6] p-5 lg:border-b-0 lg:border-r">
          <div className="rounded-[26px] border border-black/6 bg-white p-4">
            <p className="font-heading text-2xl font-bold text-[var(--color-ink)]">Ruguna</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Learn online
            </p>
          </div>

          <div className="mt-5 grid gap-2">
            {previewNav.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${
                  item.active
                    ? "bg-[var(--color-ink)] text-white"
                    : "bg-white text-[var(--color-muted)]"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[26px] bg-[var(--color-ink)] p-4 text-white">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">
              Next deadline
            </p>
            <p className="font-heading mt-3 text-xl font-bold">{primaryCourse.nextDeadline}</p>
            <p className="mt-2 text-sm leading-6 text-white/72">
              Keep moving through lessons and assessments to remain certificate eligible.
            </p>
          </div>
        </aside>

        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 border-b border-black/6 pb-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                eLearning workspace
              </p>
              <h3 className="font-heading mt-3 text-3xl font-bold text-[var(--color-ink)]">
                Welcome back, Amina
              </h3>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Continue with {currentLesson.title} and stay on track for your next submission.
              </p>
            </div>
            <div className="relative w-full max-w-[280px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
              <div className="rounded-full border border-black/6 bg-white px-12 py-3 text-sm text-[var(--color-muted)]">
                Search lessons
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {[
              { label: "Current courses", value: "2" },
              { label: "Completed", value: "1" },
              { label: "Quiz score trend", value: "82%" },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-[26px] border border-black/6 bg-white p-5"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  {card.label}
                </p>
                <p className="font-heading mt-4 text-3xl font-bold text-[var(--color-ink)]">
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px]">
            <div className="grid gap-4 md:grid-cols-2">
              {[primaryCourse, secondaryCourse].map((course) => (
                <div
                  key={course.slug}
                  className="rounded-[28px] border border-black/6 bg-white p-5"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    {course.award}
                  </p>
                  <h4 className="font-heading mt-3 text-2xl font-bold text-[var(--color-ink)]">
                    {course.title}
                  </h4>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    {getRecommendedLesson(course).title}
                  </p>
                  <div className="mt-5">
                    <ProgressBar value={course.progress} />
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 text-sm text-[var(--color-muted)]">
                    <span>{course.progress}% complete</span>
                    <StatusBadge
                      value={course.progress >= 100 ? "Ready to review" : "Continue"}
                      tone="success"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[28px] border border-black/6 bg-white p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                Today
              </p>
              <div className="mt-4 grid gap-3">
                {[
                  { label: "Live theory session", icon: CalendarClock },
                  { label: "Assessment window open", icon: CirclePlay },
                  { label: "Certificate record ready", icon: FileBadge2 },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-[22px] bg-[var(--color-surface-alt)] p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white">
                      <item.icon className="h-4 w-4 text-[var(--color-ink)]" />
                    </div>
                    <p className="text-sm text-[var(--color-muted)]">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
