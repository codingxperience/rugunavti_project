import { PrototypeRuntime } from "@/components/site/proto-runtime";
import { student_lifeHtml } from "@/proto/student-life.html";
import { publicPageMetadata } from "@/lib/site-metadata";

export const metadata = publicPageMetadata("/student-life");

export default function StudentLifePage() {
  return (
    <>
      <div className="rg" dangerouslySetInnerHTML={{ __html: student_lifeHtml }} />
      <PrototypeRuntime />
    </>
  );
}
