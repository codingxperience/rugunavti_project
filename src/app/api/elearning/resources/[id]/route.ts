import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { hasSupabase } from "@/lib/platform/env";
import { createSignedDownloadUrl } from "@/lib/platform/storage";
import { requireApiUser } from "@/lib/platform/users";

function safeFilename(title: string, mimeType: string) {
  const extension = mimeType.includes("csv") ? "csv" : mimeType.includes("pdf") ? "txt" : "txt";
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return `${base || "ruguna-resource"}.${extension}`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiUser(["student", "instructor", "registrar_admin", "super_admin"]);

  if (!auth.ok) {
    return NextResponse.json(auth.response, { status: auth.status });
  }

  const { id } = await params;
  const db = getDb();
  const resource = await db.lessonResource.findUnique({
    where: { id },
    include: {
      lesson: {
        include: {
          module: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  });

  if (!resource) {
    return NextResponse.json(
      { success: false, message: "Resource was not found." },
      { status: 404 }
    );
  }

  const course = resource.lesson.module.course;

  if (auth.session.role === "student") {
    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: auth.user.id,
          courseId: course.id,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { success: false, message: "You must be enrolled in this course to download resources." },
        { status: 403 }
      );
    }
  }

  if (resource.fileUrl.startsWith("http://") || resource.fileUrl.startsWith("https://")) {
    return NextResponse.redirect(resource.fileUrl);
  }

  if (resource.fileUrl.startsWith("/seeded-resources/")) {
    const body = [
      "Ruguna eLearning resource",
      "",
      `Course: ${course.title}`,
      `Lesson: ${resource.lesson.title}`,
      `Resource: ${resource.title}`,
      "",
      resource.description ??
        "Use this sheet to review the lesson objective, prepare your activity evidence, and record questions for your instructor before the next checkpoint.",
    ].join("\n");

    return new NextResponse(body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${safeFilename(resource.title, resource.mimeType)}"`,
      },
    });
  }

  if (!hasSupabase) {
    return NextResponse.json(
      { success: false, message: "Private storage is not configured." },
      { status: 503 }
    );
  }

  const signedUrl = await createSignedDownloadUrl({
    bucket: process.env.SUPABASE_BUCKET_PRIVATE || "ruguna-private",
    path: resource.fileUrl.replace(/^\/+/, ""),
  });

  return NextResponse.redirect(signedUrl);
}
