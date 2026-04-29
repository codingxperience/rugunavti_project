import { redirect } from "next/navigation";

import { PortalLayout } from "@/components/platform/portal-layout";
import { ProfileSettingsPanel } from "@/components/platform/profile-settings-panel";
import { getDisplayInitials, resolveDisplayName } from "@/lib/platform/display-name";
import { getPortalHeadingForRole, getPortalNavForRole } from "@/lib/platform/portal-nav";
import { getCurrentSession } from "@/lib/platform/session";
import { ensureUserForSession } from "@/lib/platform/users";

export const dynamic = "force-dynamic";

export default async function AccountSettingsPage() {
  const session = await getCurrentSession();

  if (!session.isAuthenticated) {
    redirect("/elearning/login?next=/account/settings");
  }

  const user = await ensureUserForSession(session);
  const displayName = resolveDisplayName({
    firstName: user.profile?.firstName,
    lastName: user.profile?.lastName,
    name: session.name,
    email: user.email || session.email,
    fallback: "Ruguna User",
  });
  const portal = getPortalHeadingForRole(session.role);

  return (
    <PortalLayout
      heading="Account settings"
      caption="Profile photo, contact details, security access, and support preferences."
      userName={displayName}
      userAvatarUrl={user.profile?.avatarUrl ?? session.avatarUrl}
      navItems={getPortalNavForRole(session.role)}
      searchHref={portal.searchHref}
      searchPlaceholder={portal.searchPlaceholder}
    >
      <ProfileSettingsPanel
        profile={{
          displayName,
          initials: getDisplayInitials(displayName),
          avatarUrl: user.profile?.avatarUrl ?? session.avatarUrl,
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
    </PortalLayout>
  );
}
