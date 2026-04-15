export const clerkAppearance = {
  variables: {
    colorPrimary: "#111111",
    colorText: "#111111",
    colorBackground: "#fbfbf7",
    colorInputBackground: "#ffffff",
    colorInputText: "#111111",
    colorNeutral: "#e5e7eb",
    borderRadius: "18px",
  },
  elements: {
    rootBox: "w-full",
    card: "w-full border-0 bg-transparent p-0 shadow-none",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    socialButtonsBlockButton:
      "h-12 rounded-2xl border border-[var(--color-border)] bg-white text-sm font-semibold text-[var(--color-ink)] shadow-none hover:bg-[var(--color-soft-accent)]",
    socialButtonsBlockButtonText: "font-semibold text-[var(--color-ink)]",
    dividerLine: "bg-[var(--color-border)]",
    dividerText: "text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]",
    formFieldLabel:
      "mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]",
    formFieldInput:
      "h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-ink)] focus:border-[var(--color-ink)]/25 focus:ring-4 focus:ring-[var(--color-soft-accent)]",
    formButtonPrimary:
      "h-12 rounded-full bg-[var(--color-ink)] text-sm font-semibold text-white shadow-none hover:bg-black",
    footerActionText: "text-sm text-[var(--color-muted)]",
    footerActionLink: "font-semibold text-[var(--color-ink)]",
    formResendCodeLink: "font-semibold text-[var(--color-ink)]",
    otpCodeFieldInput:
      "h-12 rounded-2xl border border-[var(--color-border)] bg-white text-[var(--color-ink)]",
    alertText: "text-sm text-[var(--color-muted)]",
  },
} as const;
