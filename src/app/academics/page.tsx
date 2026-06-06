import type { Metadata } from "next";

import { PrototypeRuntime } from "@/components/site/proto-runtime";
import { academicsHtml } from "@/proto/academics.html";

export const metadata: Metadata = { title: "Academics" };

export default function AcademicsPage() {
  return (
    <>
      <div className="rg" dangerouslySetInnerHTML={{ __html: academicsHtml }} />
      <PrototypeRuntime />
    </>
  );
}
