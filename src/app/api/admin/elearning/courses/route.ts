import { AuditAction, ContentStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";
import { courseUpsertSchema } from "@/lib/platform/schemas";
import { requireApiUser } from "@/lib/platform/users";

export async function GET() {
  const auth = await requireApiUser(["instructor", "registrar_admin", "super_admin"]);

  if (!auth.ok) {
    return NextResponse.json(auth.response, { status: auth.status });
  }

  const db = getDb();
  const courses = await db.course.findMany({
    where:
      auth.session.role === "instructor"
        ? { OR: [{ ownerId: auth.user.id }, { ownerId: null }] }
        : {},
    include: {
      school: true,
      program: true,
      modules: {
        include: {
          lessons: true,
        },
        orderBy: { position: "asc" },
      },
      enrollments: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  return NextResponse.json({
    success: true,
    courses: courses.map((course) => ({
      id: course.id,
      slug: course.slug,
      title: course.title,
      status: course.status,
      school: course.school.name,
      program: course.program.title,
      modules: course.modules.length,
      lessons: course.modules.reduce((count, module) => count + module.lessons.length, 0),
      enrollments: course.enrollments.length,
      updatedAt: course.updatedAt,
    })),
  });
}

export async function POST(request: Request) {
  const auth = await requireApiUser(["instructor", "registrar_admin", "super_admin"]);

  if (!auth.ok) {
    return NextResponse.json(auth.response, { status: auth.status });
  }

  const payload = await request.json().catch(() => null);
  const result = courseUpsertSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors: result.error.flatten() },
      { status: 400 }
    );
  }

  const db = getDb();
  const values = result.data;

  try {
    const existing = values.id ? await db.course.findUnique({ where: { id: values.id } }) : null;

    if (existing && auth.session.role === "instructor" && existing.ownerId && existing.ownerId !== auth.user.id) {
      return NextResponse.json(
        { success: false, message: "You can only edit courses assigned to you." },
        { status: 403 }
      );
    }

    const course = values.id
      ? await db.course.update({
          where: { id: values.id },
          data: {
            programId: values.programId,
            schoolId: values.schoolId,
            slug: values.slug,
            title: values.title,
            summary: values.summary,
            description: values.description,
            deliveryMode: values.deliveryMode,
            estimatedHours: values.estimatedHours,
            thumbnailUrl: values.thumbnailUrl,
            status: values.published ? ContentStatus.PUBLISHED : ContentStatus.DRAFT,
            ownerId: existing?.ownerId ?? auth.user.id,
          },
        })
      : await db.course.create({
          data: {
            programId: values.programId,
            schoolId: values.schoolId,
            slug: values.slug,
            title: values.title,
            summary: values.summary,
            description: values.description,
            deliveryMode: values.deliveryMode,
            estimatedHours: values.estimatedHours,
            thumbnailUrl: values.thumbnailUrl,
            status: values.published ? ContentStatus.PUBLISHED : ContentStatus.DRAFT,
            ownerId: auth.user.id,
          },
        });

    await writeAuditLog({
      actorId: auth.user.id,
      action: values.id ? AuditAction.UPDATE : AuditAction.CREATE,
      entityType: "Course",
      entityId: course.id,
      summary: `${auth.user.email} ${values.id ? "updated" : "created"} course ${course.title}.`,
      payload: {
        slug: course.slug,
        status: course.status,
      },
    });

    return NextResponse.json({
      success: true,
      message: values.id ? "Course updated." : "Course created.",
      course,
    });
  } catch (error) {
    console.error("Course upsert failed", error);

    return NextResponse.json(
      { success: false, message: "Course could not be saved." },
      { status: 500 }
    );
  }
}
