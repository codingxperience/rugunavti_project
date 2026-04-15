import Link from "next/link";

import { ProgressBar } from "@/components/platform/progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { learnerContinueList } from "@/data";

export default function ContinueLearningPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            Continue learning
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Resume the next lesson in each active course and stay ahead of deadlines.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {learnerContinueList.map((item) => (
          <Card key={`${item.courseSlug}-${item.lessonId}`}>
            <CardContent className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-center">
              <div>
                <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                  {item.courseTitle}
                </h2>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  Next lesson: {item.lessonTitle}
                </p>
                <div className="mt-5">
                  <ProgressBar value={item.progress} />
                </div>
                <p className="mt-3 text-sm text-[var(--color-muted)]">
                  Next deadline: {item.deadline}
                </p>
              </div>
              <div className="flex justify-start xl:justify-end">
                <Button asChild>
                  <Link href={`/learn/course/${item.courseSlug}?lesson=${item.lessonId}`}>
                    Resume lesson
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
