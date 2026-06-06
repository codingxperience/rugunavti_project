import type { Metadata } from "next";

import { PrototypeRuntime } from "@/components/site/proto-runtime";
import { verificationHtml } from "@/proto/verification.html";

export const metadata: Metadata = { title: "Verification" };

export default function Page() {
  return (
    <>
      <div className="rg" dangerouslySetInnerHTML={{ __html: verificationHtml }} />
      <PrototypeRuntime />
    </>
  );
}
