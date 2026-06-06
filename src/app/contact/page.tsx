import type { Metadata } from "next";

import { PrototypeRuntime } from "@/components/site/proto-runtime";
import { contactHtml } from "@/proto/contact.html";

export const metadata: Metadata = { title: "Contact" };

export default function Page() {
  return (
    <>
      <div className="rg" dangerouslySetInnerHTML={{ __html: contactHtml }} />
      <PrototypeRuntime />
    </>
  );
}
