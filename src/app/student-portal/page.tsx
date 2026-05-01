import { redirect } from "next/navigation";

export default function StudentPortalRedirectPage() {
  redirect("/elearning/login?next=%2Flearn%2Fdashboard");
}
