"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supportTicketSchema, type SupportTicketInput } from "@/lib/platform/schemas";

type LearnerSupportFormProps = {
  categories: string[];
};

export function LearnerSupportForm({ categories }: LearnerSupportFormProps) {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const form = useForm<SupportTicketInput>({
    resolver: zodResolver(supportTicketSchema),
    defaultValues: {
      category: categories[0] ?? "Learning support",
      subject: "",
      message: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerMessage(null);
    setTicketNumber(null);

    const response = await fetch("/api/elearning/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = (await response.json()) as {
      success: boolean;
      message: string;
      ticket?: { ticketNumber: string };
    };

    setServerMessage(payload.message);
    setTicketNumber(payload.ticket?.ticketNumber ?? null);

    if (response.ok && payload.success) {
      form.reset({
        category: categories[0] ?? "Learning support",
        subject: "",
        message: "",
      });
    }
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="grid gap-2 text-sm font-medium">
        Support category
        <select
          {...form.register("category")}
          className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-ink)]/25 focus:ring-4 focus:ring-[var(--color-soft-accent)]"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm font-medium">
        Subject
        <Input {...form.register("subject")} placeholder="Example: Assignment upload issue" />
        <FieldError error={form.formState.errors.subject?.message} />
      </label>

      <label className="grid gap-2 text-sm font-medium">
        Message
        <Textarea
          {...form.register("message")}
          placeholder="Tell learner support exactly what happened and what you need."
        />
        <FieldError error={form.formState.errors.message?.message} />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Opening ticket..." : "Open support ticket"}
        </Button>
        {serverMessage ? (
          <p className="text-sm text-[var(--color-muted)]">
            {serverMessage}
            {ticketNumber ? ` Reference: ${ticketNumber}` : ""}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return <span className="text-xs font-medium text-rose-600">{error}</span>;
}
