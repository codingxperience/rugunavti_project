import { ProfileSettingsPanel } from "@/components/platform/profile-settings-panel";
import { getDisplayInitials, resolveDisplayName } from "@/lib/platform/display-name";
import { ensureUserForSession } from "@/lib/platform/users";

export const dynamic = "force-dynamic";

export default async function LearnProfilePage() {
  const user = await ensureUserForSession();
  const displayName = resolveDisplayName({
    firstName: user.profile?.firstName,
    lastName: user.profile?.lastName,
    email: user.email,
    fallback: "Learner",
  });

  return (
    <ProfileSettingsPanel
      profile={{
        displayName,
        initials: getDisplayInitials(displayName),
        avatarUrl: user.profile?.avatarUrl ?? null,
        firstName: user.profile?.firstName ?? displayName.split(/\s+/)[0] ?? "",
        lastName: user.profile?.lastName ?? displayName.split(/\s+/).slice(1).join(" "),
        email: user.email,
        phone: user.profile?.phone ?? "",
        whatsapp: user.profile?.whatsapp ?? "",
        city: user.profile?.city ?? "",
        country: user.profile?.country ?? "Uganda",
        timezone: user.profile?.timezone ?? "Africa/Kampala",
        bio: user.profile?.bio ?? "",
      }}
    />
  );
}
