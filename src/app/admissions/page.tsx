import { PrototypeRuntime } from "@/components/site/proto-runtime";
import { admissionsHtml } from "@/proto/admissions.html";
import { publicPageMetadata } from "@/lib/site-metadata";

export const metadata = publicPageMetadata("/admissions");

export default function AdmissionsPage() {
  return (
    <>
      <div className="rg" dangerouslySetInnerHTML={{ __html: admissionsHtml }} />
      <PrototypeRuntime />
    </>
  );
}
