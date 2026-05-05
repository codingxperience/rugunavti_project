import { redirect } from "next/navigation";

import { resolveWorkspaceRoute } from "@/lib/platform/navigation";
import { getCurrentSession } from "@/lib/platform/session";

export const dynamic = "force-dynamic";

export default async function StaffPortalRedirectPage() {
  const session = await getCurrentSession();

  if (session.isAuthenticated) {
    redirect(resolveWorkspaceRoute(session, "/instructor/dashboard"));
  }

  redirect("/elearning/login?next=%2Finstructor%2Fdashboard");
}
