import { redirect } from "next/navigation";

export default function LegacySignInRedirectPage() {
  redirect("/elearning/login");
}
