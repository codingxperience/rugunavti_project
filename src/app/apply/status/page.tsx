import Link from "next/link";
import { redirect } from "next/navigation";

import { ApplicationStatusLookup } from "@/components/forms/application-status-lookup";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

type SearchParams = {
  email?: string | string[];
  reference?: string | string[];
};

export default async function ApplicationStatusPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  if (params.reference || params.email) {
    redirect("/apply/status");
  }

  return (
    <section className="section-padding pt-10 sm:pt-14">
      <div className="container-width grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card>
          <CardContent>
            <span className="eyebrow">Application status</span>
            <h1 className="font-heading mt-5 text-4xl font-bold text-[var(--color-ink)] sm:text-5xl">
              Track your Ruguna application
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              Enter the email and reference used during application. Ruguna shows only matching records.
            </p>

            <ApplicationStatusLookup />
          </CardContent>
        </Card>

        <aside className="grid gap-4 self-start lg:sticky lg:top-28">
          <Card className="bg-white">
            <CardContent>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">Reference number</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                Use it when checking admissions updates or contacting Ruguna.
              </p>
              <div className="mt-5 grid gap-3">
                <Button asChild>
                  <Link href="/elearning/login">Sign in to eLearning</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/contact">Contact admissions</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </section>
  );
}
