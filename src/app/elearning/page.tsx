import { PrototypeRuntime } from "@/components/site/proto-runtime";
import { elearningHtml } from "@/proto/elearning.html";
import { publicPageMetadata } from "@/lib/site-metadata";

export const metadata = publicPageMetadata("/elearning");

export default function ElearningLandingPage() {
  return (
    <>
      <div className="rg" dangerouslySetInnerHTML={{ __html: elearningHtml }} />
      <PrototypeRuntime />
    </>
  );
}
