"use server";

import { Buffer } from "node:buffer";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getDb } from "@/lib/db";
import { hasSupabase, platformEnv } from "@/lib/platform/env";
import { getSupabaseAdmin } from "@/lib/platform/storage";
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

const avatarMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const avatarMaxBytes = 3 * 1024 * 1024;

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function getAvatarExtension(mimeType: string) {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

async function uploadProfileAvatar(input: {
  userId: string;
  file: File;
}) {
  if (!hasSupabase || !platformEnv.supabaseUrl || !platformEnv.supabaseServiceRoleKey) {
    throw new Error("Profile photo upload needs Supabase Storage to be configured.");
  }

  if (!avatarMimeTypes.has(input.file.type)) {
    throw new Error("Upload a JPG, PNG, or WebP profile photo.");
  }

  if (input.file.size > avatarMaxBytes) {
    throw new Error("Profile photos must be 3 MB or smaller.");
  }

  const supabase = getSupabaseAdmin();
  const extension = getAvatarExtension(input.file.type);
  const path = `profiles/${input.userId}/avatar-${Date.now()}.${extension}`;
  const buffer = Buffer.from(await input.file.arrayBuffer());
  const { error } = await supabase.storage.from(platformEnv.supabasePublicBucket).upload(path, buffer, {
    contentType: input.file.type,
    upsert: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  return supabase.storage.from(platformEnv.supabasePublicBucket).getPublicUrl(path).data.publicUrl;
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
  const avatarFile = formData.get("avatar");
  const removeAvatar = formData.get("removeAvatar") === "true";
  let avatarUrl: string | null | undefined;

  try {
    if (avatarFile instanceof File && avatarFile.size > 0) {
      avatarUrl = await uploadProfileAvatar({ userId: user.id, file: avatarFile });
    } else if (removeAvatar) {
      avatarUrl = null;
    }
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Profile photo upload failed.",
    };
  }

  const profileData = {
    ...parsed.data,
    ...(avatarUrl !== undefined ? { avatarUrl } : {}),
  };

  await db.profile.upsert({
    where: { userId: user.id },
    update: profileData,
    create: {
      userId: user.id,
      ...profileData,
    },
  });

  await db.auditLog.create({
    data: {
      actorId: user.id,
      action: "UPDATE",
      entityType: "Profile",
      entityId: user.id,
      summary: `${user.email} updated account profile and learning preferences.`,
      payload: {
        fields: Object.keys(profileData),
      },
    },
  });

  revalidatePath("/account/settings");
  revalidatePath("/learn/profile");
  revalidatePath("/learn/dashboard");
  revalidatePath("/instructor/dashboard");
  revalidatePath("/admin/elearning");

  return {
    status: "success",
    message: "Your profile has been updated.",
  };
}
