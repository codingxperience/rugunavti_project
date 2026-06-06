import type { Metadata } from "next";

import { PrototypeRuntime } from "@/components/site/proto-runtime";
import { aboutHtml } from "@/proto/about.html";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <div className="rg" dangerouslySetInnerHTML={{ __html: aboutHtml }} />
      <PrototypeRuntime />
    </>
  );
}
