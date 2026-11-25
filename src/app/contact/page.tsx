import { PrototypeRuntime } from "@/components/site/proto-runtime";
import { contactHtml } from "@/proto/contact.html";
import { publicPageMetadata } from "@/lib/site-metadata";

export const metadata = publicPageMetadata("/contact");

export default function Page() {
  return (
    <>
      <div className="rg" dangerouslySetInnerHTML={{ __html: contactHtml }} />
      <PrototypeRuntime />
    </>
  );
}
