import { PrototypeRuntime } from "@/components/site/proto-runtime";
import { homeHtml } from "@/proto/home.html";

export default function HomePage() {
  return (
    <>
      <div className="rg" dangerouslySetInnerHTML={{ __html: homeHtml }} />
      <PrototypeRuntime />
    </>
  );
}
