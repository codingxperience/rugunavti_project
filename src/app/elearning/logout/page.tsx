import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DEV_SESSION_COOKIE } from "@/lib/platform/auth";
import { clearClerkBridgeSession } from "@/lib/platform/bridge-session";

export default async function ElearningLogoutPage() {
  const cookieStore = await cookies();
  cookieStore.delete(DEV_SESSION_COOKIE);
  await clearClerkBridgeSession();
  redirect("/elearning/login");
}
