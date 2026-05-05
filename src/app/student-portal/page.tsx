import { redirect } from "next/navigation";

import { resolveWorkspaceRoute } from "@/lib/platform/navigation";
import { getCurrentSession } from "@/lib/platform/session";

export const dynamic = "force-dynamic";

export default async function StudentPortalRedirectPage() {
  const session = await getCurrentSession();

  if (session.isAuthenticated) {
    redirect(resolveWorkspaceRoute(session, "/learn/dashboard"));
  }

  redirect("/elearning/login?next=%2Flearn%2Fdashboard");
}
