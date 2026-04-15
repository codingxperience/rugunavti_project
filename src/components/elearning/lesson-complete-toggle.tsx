"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const STORAGE_KEY = "ruguna-lesson-completions";

type CompletionMap = Record<string, boolean>;

export function LessonCompleteToggle({
  courseSlug,
  lessonId,
}: {
  courseSlug: string;
  lessonId: string;
}) {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const completions = raw ? (JSON.parse(raw) as CompletionMap) : {};
      setIsComplete(Boolean(completions[`${courseSlug}:${lessonId}`]));
    } catch {
      setIsComplete(false);
    }
  }, [courseSlug, lessonId]);

  function handleToggle() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const completions = raw ? (JSON.parse(raw) as CompletionMap) : {};
      const key = `${courseSlug}:${lessonId}`;
      const next = !Boolean(completions[key]);
      const updated = { ...completions, [key]: next };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setIsComplete(next);
    } catch {
      setIsComplete((current) => !current);
    }
  }

  return (
    <Button type="button" variant={isComplete ? "secondary" : "default"} onClick={handleToggle}>
      {isComplete ? "Marked complete" : "Mark lesson complete"}
    </Button>
  );
}
