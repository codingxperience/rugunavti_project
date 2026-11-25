import { PrototypeRuntime } from "@/components/site/proto-runtime";
import { aboutHtml } from "@/proto/about.html";
import { publicPageMetadata } from "@/lib/site-metadata";

export const metadata = publicPageMetadata("/about");

export default function AboutPage() {
  return (
    <>
      <div className="rg" dangerouslySetInnerHTML={{ __html: aboutHtml }} />
      <PrototypeRuntime />
    </>
  );
}
