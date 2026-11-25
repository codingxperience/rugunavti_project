import { PrototypeRuntime } from "@/components/site/proto-runtime";
import { verificationHtml } from "@/proto/verification.html";
import { publicPageMetadata } from "@/lib/site-metadata";

export const metadata = publicPageMetadata("/verification");

export default function Page() {
  return (
    <>
      <div className="rg" dangerouslySetInnerHTML={{ __html: verificationHtml }} />
      <PrototypeRuntime />
    </>
  );
}
