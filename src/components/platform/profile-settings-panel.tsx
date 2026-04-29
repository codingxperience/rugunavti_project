"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  BookOpenCheck,
  CheckCircle2,
  LifeBuoy,
  Loader2,
  LockKeyhole,
  Mail,
  MapPin,
  ShieldCheck,
  Smartphone,
  UserRound,
} from "lucide-react";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";

import {
  updateLearnerProfileAction,
  type ProfileActionState,
} from "@/app/learn/profile/actions";
import { PortalSignOutButton } from "@/components/platform/portal-sign-out-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ProfileSettingsPanelProps = {
  profile: {
    displayName: string;
    initials: string;
    avatarUrl: string | null;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    whatsapp: string;
    city: string;
    country: string;
    timezone: string;
    bio: string;
  };
};

const initialState: ProfileActionState = {
  status: "idle",
  message: "",
};

const settingLinks = [
  { href: "#profile-account", label: "Profile & account", icon: UserRound },
  { href: "#learning-preferences", label: "Learning preferences", icon: BookOpenCheck },
  { href: "#security", label: "Privacy & security", icon: ShieldCheck },
  { href: "#support", label: "Help & support", icon: LifeBuoy },
];

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="mt-2 text-xs font-semibold text-red-600">{errors[0]}</p>;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="min-w-40">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
      {pending ? "Saving" : "Save changes"}
    </Button>
  );
}

function SettingsNavLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: typeof UserRound;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--color-muted)] transition hover:bg-white hover:text-[var(--color-ink)]"
    >
      <Icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110" />
      {label}
    </Link>
  );
}

export function ProfileSettingsPanel({ profile }: ProfileSettingsPanelProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(updateLearnerProfileAction, initialState);

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
    }
  }, [router, state.status]);

  return (
    <div className="grid gap-6 2xl:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="2xl:sticky 2xl:top-8 2xl:self-start">
        <div className="rounded-[32px] border border-black/6 bg-[#f6f5ef] p-4 shadow-[0_26px_70px_-54px_rgba(17,17,17,0.55)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
            Learner settings
          </p>
          <h1 className="font-heading mt-3 text-4xl font-bold tracking-[-0.05em] text-[var(--color-ink)]">
            Profile
          </h1>
          <nav className="mt-7 grid gap-2">
            {settingLinks.map((item) => (
              <SettingsNavLink key={item.href} {...item} />
            ))}
          </nav>
        </div>
      </aside>

      <div className="grid gap-5">
        <form
          action={formAction}
          id="profile-account"
          className="rounded-[34px] border border-black/6 bg-white p-5 shadow-[0_32px_90px_-70px_rgba(17,17,17,0.52)] sm:p-7"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/8 bg-[#111111] text-2xl font-bold text-white shadow-[0_18px_40px_-30px_rgba(17,17,17,0.8)]">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt={`${profile.displayName} profile photo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                profile.initials
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                Profile & account
              </p>
              <h2 className="font-heading mt-2 truncate text-3xl font-bold text-[var(--color-ink)]">
                {profile.displayName}
              </h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-[var(--color-muted)]">
                <Mail className="h-4 w-4" />
                {profile.email}
              </p>
            </div>
          </div>

          {state.message ? (
            <div
              className={cn(
                "mt-6 rounded-2xl border px-4 py-3 text-sm font-semibold",
                state.status === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-700"
              )}
            >
              {state.message}
            </div>
          ) : null}

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
              First name
              <Input name="firstName" defaultValue={profile.firstName} autoComplete="given-name" />
              <FieldError errors={state.fieldErrors?.firstName} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
              Last name
              <Input name="lastName" defaultValue={profile.lastName} autoComplete="family-name" />
              <FieldError errors={state.fieldErrors?.lastName} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)] md:col-span-2">
              Email address
              <Input value={profile.email} readOnly className="bg-[#f6f5ef] text-[var(--color-muted)]" />
            </label>
          </div>

          <div id="learning-preferences" className="mt-10 border-t border-black/6 pt-8">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-accent)]/70">
                <Bell className="h-5 w-5 text-[var(--color-ink)]" />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                  Contact and learning preferences
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                  Keep these details current so Ruguna can reach you for class notices, blended
                  sessions, support follow-up, and certificate records.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
                Phone number
                <Input name="phone" defaultValue={profile.phone} autoComplete="tel" />
                <FieldError errors={state.fieldErrors?.phone} />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
                WhatsApp number
                <Input name="whatsapp" defaultValue={profile.whatsapp} autoComplete="tel" />
                <FieldError errors={state.fieldErrors?.whatsapp} />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
                City or district
                <Input name="city" defaultValue={profile.city} autoComplete="address-level2" />
                <FieldError errors={state.fieldErrors?.city} />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
                Country
                <Input name="country" defaultValue={profile.country} autoComplete="country-name" />
                <FieldError errors={state.fieldErrors?.country} />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)] md:col-span-2">
                Time zone
                <Input name="timezone" defaultValue={profile.timezone} />
                <FieldError errors={state.fieldErrors?.timezone} />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)] md:col-span-2">
                Learning bio
                <Textarea name="bio" defaultValue={profile.bio} />
                <FieldError errors={state.fieldErrors?.bio} />
              </label>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <SubmitButton />
          </div>
        </form>

        <section
          id="security"
          className="grid gap-4 rounded-[34px] border border-black/6 bg-white p-5 shadow-[0_26px_80px_-66px_rgba(17,17,17,0.5)] sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-white">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                Privacy & security
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                Password reset and sign-out are handled through the secure Ruguna eLearning auth
                flow. Your course records stay attached to this account.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Button asChild variant="secondary">
              <Link href="/elearning/forgot-password">Reset password</Link>
            </Button>
            <PortalSignOutButton className="border-black/10 bg-[var(--color-ink)] text-white hover:bg-black hover:text-white" />
          </div>
        </section>

        <section id="support" className="grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Learning support",
              text: "Ask about lessons, assignments, quizzes, or access problems.",
              href: "/learn/help",
              icon: LifeBuoy,
              cta: "Open support desk",
            },
            {
              title: "WhatsApp support",
              text: "Use WhatsApp for quick access follow-up and class reminders.",
              href: "https://wa.me/256700123456?text=Hello%20Ruguna%20eLearning%20support",
              icon: Smartphone,
              cta: "Message Ruguna",
            },
            {
              title: "Contact records desk",
              text: "Reach admissions or records for certificate and account questions.",
              href: "/elearning/contact",
              icon: MapPin,
              cta: "Contact Ruguna",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-[28px] border border-black/6 bg-white p-5 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-48px_rgba(17,17,17,0.62)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f6f5ef] text-[var(--color-ink)]">
                  <Icon className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110" />
                </div>
                <h3 className="font-heading mt-5 text-xl font-bold text-[var(--color-ink)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{item.text}</p>
                <p className="mt-5 text-sm font-bold text-[var(--color-ink)]">{item.cta}</p>
              </Link>
            );
          })}
        </section>
      </div>
    </div>
  );
}
