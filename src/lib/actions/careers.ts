"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { logAudit } from "@/lib/audit";

const JobSchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and dashes only."),
  titleEn: z.string().min(2),
  titleAr: z.string().min(2),
  descriptionEn: z.string().min(2),
  descriptionAr: z.string().min(2),
  isOpen: z.boolean(),
  closesAt: z.string().optional(),
});

export type JobFormState = { error?: string } | undefined;

export async function saveJobAction(
  _prevState: JobFormState,
  formData: FormData,
): Promise<JobFormState> {
  const session = await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);

  const id = formData.get("id")?.toString() || undefined;
  const parsed = JobSchema.safeParse({
    slug: formData.get("slug"),
    titleEn: formData.get("titleEn"),
    titleAr: formData.get("titleAr"),
    descriptionEn: formData.get("descriptionEn"),
    descriptionAr: formData.get("descriptionAr"),
    isOpen: formData.get("isOpen") === "on",
    closesAt: formData.get("closesAt")?.toString() || undefined,
  });

  if (!parsed.success) {
    return { error: "Please check the form fields." };
  }

  const { closesAt, ...rest } = parsed.data;
  const data = { ...rest, closesAt: closesAt ? new Date(closesAt) : null };

  if (id) {
    await prisma.jobOpening.update({ where: { id }, data });
    await logAudit({
      userId: session.user.id,
      action: "JOB_UPDATE",
      entityType: "JobOpening",
      entityId: id,
      diff: data,
    });
  } else {
    const existing = await prisma.jobOpening.findUnique({ where: { slug: parsed.data.slug } });
    if (existing) return { error: "A job with this slug already exists." };
    const created = await prisma.jobOpening.create({ data });
    await logAudit({
      userId: session.user.id,
      action: "JOB_CREATE",
      entityType: "JobOpening",
      entityId: created.id,
      diff: data,
    });
  }

  revalidatePath("/[locale]/admin/careers", "page");
  revalidatePath("/[locale]/careers", "page");
  redirect(`/admin/careers`);
}

export async function deleteJobAction(id: string) {
  const session = await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  await prisma.jobOpening.delete({ where: { id } });
  await logAudit({
    userId: session.user.id,
    action: "JOB_DELETE",
    entityType: "JobOpening",
    entityId: id,
    diff: {},
  });
  revalidatePath("/[locale]/admin/careers", "page");
  revalidatePath("/[locale]/careers", "page");
}
