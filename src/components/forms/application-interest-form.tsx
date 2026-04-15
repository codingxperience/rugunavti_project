"use client";

import type { ReactNode, SelectHTMLAttributes } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type ApplicationFormInput, applicationFormSchema } from "@/lib/platform/schemas";

type ApplicationInterestFormProps = {
  intakeOptions: string[];
  programOptions: string[];
};

export function ApplicationInterestForm({
  intakeOptions,
  programOptions,
}: ApplicationInterestFormProps) {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const form = useForm<ApplicationFormInput>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      whatsapp: "",
      nationality: "Ugandan",
      preferredLevel: "Certificate",
      preferredIntake: intakeOptions[0] ?? "",
      firstChoice: programOptions[0] ?? "",
      secondChoice: programOptions[1] ?? "",
      studyMode: "Blended",
      goals: "",
      previousSchool: "",
      highestQualification: "UCE",
      yearCompleted: "2025",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerMessage(null);
    setReference(null);

    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = (await response.json()) as {
      success: boolean;
      message: string;
      reference?: string;
    };

    setServerMessage(payload.message);
    setReference(payload.reference ?? null);
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Full name" error={form.formState.errors.fullName?.message}>
          <Input {...form.register("fullName")} placeholder="Enter full name" />
        </Field>
        <Field label="Email address" error={form.formState.errors.email?.message}>
          <Input {...form.register("email")} placeholder="name@example.com" type="email" />
        </Field>
        <Field label="WhatsApp number" error={form.formState.errors.whatsapp?.message}>
          <Input {...form.register("whatsapp")} placeholder="+256..." />
        </Field>
        <Field label="Nationality" error={form.formState.errors.nationality?.message}>
          <Select {...form.register("nationality")} options={["Ugandan", "Kenyan", "Tanzanian", "Rwandan", "Other"]} />
        </Field>
        <Field label="Preferred award level" error={form.formState.errors.preferredLevel?.message}>
          <Select {...form.register("preferredLevel")} options={["Short Course", "Certificate", "Diploma", "Bachelor's"]} />
        </Field>
        <Field label="Preferred intake" error={form.formState.errors.preferredIntake?.message}>
          <Select {...form.register("preferredIntake")} options={intakeOptions} />
        </Field>
        <Field label="First programme choice" error={form.formState.errors.firstChoice?.message} className="md:col-span-2">
          <Select {...form.register("firstChoice")} options={programOptions} />
        </Field>
        <Field label="Second programme choice" error={form.formState.errors.secondChoice?.message} className="md:col-span-2">
          <Select {...form.register("secondChoice")} options={programOptions} />
        </Field>
        <Field label="Preferred study mode" error={form.formState.errors.studyMode?.message}>
          <Select {...form.register("studyMode")} options={["Day", "Evening", "Weekend", "Blended", "Online"]} />
        </Field>
        <Field label="Highest qualification" error={form.formState.errors.highestQualification?.message}>
          <Select {...form.register("highestQualification")} options={["UCE", "UACE", "Certificate", "Diploma", "Bachelor's"]} />
        </Field>
        <Field label="Previous school or institution" error={form.formState.errors.previousSchool?.message} className="md:col-span-2">
          <Input {...form.register("previousSchool")} placeholder="Most recent school or institution" />
        </Field>
        <Field label="Year completed" error={form.formState.errors.yearCompleted?.message}>
          <Input {...form.register("yearCompleted")} placeholder="YYYY" />
        </Field>
        <Field label="Goals and study context" error={form.formState.errors.goals?.message} className="md:col-span-2">
          <Textarea
            {...form.register("goals")}
            className="min-h-28"
            placeholder="Share your goals, preferred school, and anything admissions should know."
          />
        </Field>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Submitting..." : "Submit Application Interest"}
        </Button>
        {serverMessage ? (
          <p className="text-sm text-[var(--color-muted)]">
            {serverMessage}
            {reference ? ` Reference: ${reference}` : ""}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  error,
  className,
}: {
  label: string;
  children: ReactNode;
  error?: string;
  className?: string;
}) {
  return (
    <label className={`grid gap-2 text-sm font-medium text-[var(--color-ink)] ${className ?? ""}`}>
      {label}
      {children}
      {error ? <span className="text-xs font-medium text-rose-600">{error}</span> : null}
    </label>
  );
}

function Select(
  props: SelectHTMLAttributes<HTMLSelectElement> & { options: string[] }
) {
  const { options, ...rest } = props;

  return (
    <select
      {...rest}
      className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-ink)]/25 focus:ring-4 focus:ring-[var(--color-soft-accent)]"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
