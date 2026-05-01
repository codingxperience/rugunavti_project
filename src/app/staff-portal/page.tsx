import { redirect } from "next/navigation";

export default function StaffPortalRedirectPage() {
  redirect("/elearning/login?next=%2Finstructor%2Fdashboard");
}
