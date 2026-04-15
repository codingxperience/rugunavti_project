"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type ContactFormInput, contactFormSchema } from "@/lib/platform/schemas";

export function ContactForm({ categories }: { categories: string[] }) {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const form = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      emailOrPhone: "",
      category: categories[0] ?? "",
      message: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerMessage(null);
    setReference(null);

    const response = await fetch("/api/contact", {
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

    if (response.ok) {
      form.reset();
    }
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Full name
          <Input {...form.register("fullName")} placeholder="Your full name" />
          <FieldError error={form.formState.errors.fullName?.message} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Email or phone
          <Input {...form.register("emailOrPhone")} placeholder="How should we reply?" />
          <FieldError error={form.formState.errors.emailOrPhone?.message} />
        </label>
      </div>

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
        Message
        <Textarea
          {...form.register("message")}
          className="min-h-32"
          placeholder="Tell the team what you need help with."
        />
        <FieldError error={form.formState.errors.message?.message} />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Sending..." : "Send Inquiry"}
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

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return <span className="text-xs font-medium text-rose-600">{error}</span>;
}
