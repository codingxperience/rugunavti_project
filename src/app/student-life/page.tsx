import type { Metadata } from "next";

import { PrototypeRuntime } from "@/components/site/proto-runtime";
import { student_lifeHtml } from "@/proto/student-life.html";

export const metadata: Metadata = { title: "Student Life" };

export default function StudentLifePage() {
  return (
    <>
      <div className="rg" dangerouslySetInnerHTML={{ __html: student_lifeHtml }} />
      <PrototypeRuntime />
    </>
  );
}
