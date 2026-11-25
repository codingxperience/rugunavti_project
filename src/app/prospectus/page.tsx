import { PrototypeRuntime } from "@/components/site/proto-runtime";
import { prospectusHtml } from "@/proto/prospectus.html";
import { publicPageMetadata } from "@/lib/site-metadata";

export const metadata = publicPageMetadata("/prospectus");

export default function Page() {
  return (
    <>
      <div className="rg" dangerouslySetInnerHTML={{ __html: prospectusHtml }} />
      <PrototypeRuntime />
    </>
  );
}
