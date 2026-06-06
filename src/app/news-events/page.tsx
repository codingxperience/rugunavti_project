import type { Metadata } from "next";

import { PrototypeRuntime } from "@/components/site/proto-runtime";
import { news_eventsHtml } from "@/proto/news-events.html";

export const metadata: Metadata = { title: "News & Events" };

export default function NewsEventsPage() {
  return (
    <>
      <div className="rg" dangerouslySetInnerHTML={{ __html: news_eventsHtml }} />
      <PrototypeRuntime />
    </>
  );
}
