"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export function PostHogProvider() {
  useEffect(() => {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

    if (!posthogKey) {
      return;
    }

    posthog.init(posthogKey, {
      api_host: posthogHost,
      capture_pageview: true,
      persistence: "localStorage+cookie",
    });
  }, []);

  return null;
}
