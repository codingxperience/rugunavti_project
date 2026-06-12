import { redirect } from "next/navigation";

import { getDefaultWorkspaceRoute } from "@/lib/platform/navigation";
import { getCurrentSession } from "@/lib/platform/session";

export const dynamic = "force-dynamic";

export default async function StaffPortalRedirectPage() {
  const session = await getCurrentSession();

  if (session.isAuthenticated) {
    redirect(getDefaultWorkspaceRoute(session.role));
  }

  redirect("/elearning/login");
}
