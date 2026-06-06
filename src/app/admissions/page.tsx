import type { Metadata } from "next";

import { PrototypeRuntime } from "@/components/site/proto-runtime";
import { admissionsHtml } from "@/proto/admissions.html";

export const metadata: Metadata = { title: "Admissions" };

export default function AdmissionsPage() {
  return (
    <>
      <div className="rg" dangerouslySetInnerHTML={{ __html: admissionsHtml }} />
      <PrototypeRuntime />
    </>
  );
}
