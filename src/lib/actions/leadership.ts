"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { logAudit } from "@/lib/audit";
import { uploadIfPresent } from "@/lib/storage";

const LeadershipSchema = z.object({
  nameEn: z.string().min(2),
  nameAr: z.string().min(2),
  titleEn: z.string().min(2),
  titleAr: z.string().min(2),
  bioEn: z.string().min(2),
  bioAr: z.string().min(2),
  order: z.coerce.number().int().default(0),
});

export type LeadershipFormState = { error?: string } | undefined;

export async function saveLeadershipAction(
  _prevState: LeadershipFormState,
  formData: FormData,
): Promise<LeadershipFormState> {
  const session = await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);

  const id = formData.get("id")?.toString() || undefined;
  const parsed = LeadershipSchema.safeParse({
    nameEn: formData.get("nameEn"),
    nameAr: formData.get("nameAr"),
    titleEn: formData.get("titleEn"),
    titleAr: formData.get("titleAr"),
    bioEn: formData.get("bioEn"),
    bioAr: formData.get("bioAr"),
    order: formData.get("order") || 0,
  });

  if (!parsed.success) {
    return { error: "Please check the form fields." };
  }

  const photoFile = formData.get("photo") as File | null;
  const photoUrl = await uploadIfPresent(photoFile, "leadership");

  const data = { ...parsed.data, ...(photoUrl && { photoUrl }) };

  if (id) {
    await prisma.leadershipMember.update({ where: { id }, data });
    await logAudit({
      userId: session.user.id,
      action: "LEADERSHIP_UPDATE",
      entityType: "LeadershipMember",
      entityId: id,
      diff: data,
    });
  } else {
    const created = await prisma.leadershipMember.create({ data });
    await logAudit({
      userId: session.user.id,
      action: "LEADERSHIP_CREATE",
      entityType: "LeadershipMember",
      entityId: created.id,
      diff: data,
    });
  }

  revalidatePath("/[locale]/admin/leadership", "page");
  revalidatePath("/[locale]/about", "page");
  redirect(`/admin/leadership`);
}

export async function deleteLeadershipAction(id: string) {
  const session = await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  await prisma.leadershipMember.delete({ where: { id } });
  await logAudit({
    userId: session.user.id,
    action: "LEADERSHIP_DELETE",
    entityType: "LeadershipMember",
    entityId: id,
    diff: {},
  });
  revalidatePath("/[locale]/admin/leadership", "page");
  revalidatePath("/[locale]/about", "page");
}
