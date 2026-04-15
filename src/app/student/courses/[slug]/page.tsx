import { redirect } from "next/navigation";

export default async function LegacyStudentCoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lesson?: string }>;
}) {
  const { slug } = await params;
  const { lesson } = await searchParams;
  const suffix = lesson ? `?lesson=${encodeURIComponent(lesson)}` : "";

  redirect(`/learn/course/${slug}${suffix}`);
}
