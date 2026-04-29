"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getDb } from "@/lib/db";
import { ensureUserForSession } from "@/lib/platform/users";

export type ProfileActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

const optionalText = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength)
    .transform((value) => (value.length ? value : null));

const profileSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required.").max(80),
  lastName: z.string().trim().max(80).optional().default(""),
  phone: optionalText(40),
  whatsapp: optionalText(40),
  city: optionalText(80),
  country: optionalText(80),
  timezone: z.string().trim().min(1).max(80).default("Africa/Kampala"),
  bio: optionalText(320),
});

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export async function updateLearnerProfileAction(
  _previousState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const parsed = profileSchema.safeParse({
    firstName: readFormValue(formData, "firstName"),
    lastName: readFormValue(formData, "lastName"),
    phone: readFormValue(formData, "phone"),
    whatsapp: readFormValue(formData, "whatsapp"),
    city: readFormValue(formData, "city"),
    country: readFormValue(formData, "country"),
    timezone: readFormValue(formData, "timezone") || "Africa/Kampala",
    bio: readFormValue(formData, "bio"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await ensureUserForSession();
  const db = getDb();

  await db.profile.upsert({
    where: { userId: user.id },
    update: parsed.data,
    create: {
      userId: user.id,
      ...parsed.data,
    },
  });

  await db.auditLog.create({
    data: {
      actorId: user.id,
      action: "UPDATE",
      entityType: "Profile",
      entityId: user.id,
      summary: "Learner updated profile and learning preferences.",
      payload: {
        fields: Object.keys(parsed.data),
      },
    },
  });

  revalidatePath("/learn/profile");
  revalidatePath("/learn/dashboard");

  return {
    status: "success",
    message: "Your profile has been updated.",
  };
}
