import type { Metadata } from "next";

import { PrototypeRuntime } from "@/components/site/proto-runtime";
import { elearningHtml } from "@/proto/elearning.html";

export const metadata: Metadata = { title: "E-Learning" };

export default function ElearningLandingPage() {
  return (
    <>
      <div className="rg" dangerouslySetInnerHTML={{ __html: elearningHtml }} />
      <PrototypeRuntime />
    </>
  );
}
