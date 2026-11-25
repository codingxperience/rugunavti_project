import { PrototypeRuntime } from "@/components/site/proto-runtime";
import { publicPageMetadata } from "@/lib/site-metadata";
import { academicsHtml } from "@/proto/academics.html";

export const metadata = publicPageMetadata("/academic-overview");

export default function AcademicsPage() {
  return (
    <>
      <div className="rg" dangerouslySetInnerHTML={{ __html: academicsHtml }} />
      <PrototypeRuntime />
    </>
  );
}
