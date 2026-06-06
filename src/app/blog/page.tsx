import type { Metadata } from "next";

import { PrototypeRuntime } from "@/components/site/proto-runtime";
import { blogHtml } from "@/proto/blog.html";

export const metadata: Metadata = { title: "Blog & Insights" };

export default function Page() {
  return (
    <>
      <div className="rg" dangerouslySetInnerHTML={{ __html: blogHtml }} />
      <PrototypeRuntime />
    </>
  );
}
