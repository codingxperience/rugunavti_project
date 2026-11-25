import { PrototypeRuntime } from "@/components/site/proto-runtime";
import { news_eventsHtml } from "@/proto/news-events.html";
import { publicPageMetadata } from "@/lib/site-metadata";

export const metadata = publicPageMetadata("/news-events");

export default function NewsEventsPage() {
  return (
    <>
      <div className="rg" dangerouslySetInnerHTML={{ __html: news_eventsHtml }} />
      <PrototypeRuntime />
    </>
  );
}
