import { PrototypeRuntime } from "@/components/site/proto-runtime";
import { blogHtml } from "@/proto/blog.html";
import { publicPageMetadata } from "@/lib/site-metadata";

export const metadata = publicPageMetadata("/blog");

export default function Page() {
  return (
    <>
      <div className="rg" dangerouslySetInnerHTML={{ __html: blogHtml }} />
      <PrototypeRuntime />
    </>
  );
}
