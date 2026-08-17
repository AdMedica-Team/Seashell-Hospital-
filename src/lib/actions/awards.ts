"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { logAudit } from "@/lib/audit";
import { uploadIfPresent } from "@/lib/storage";

const AwardSchema = z.object({
  titleEn: z.string().min(2),
  titleAr: z.string().min(2),
  issuerEn: z.string().optional(),
  issuerAr: z.string().optional(),
  year: z.coerce.number().int().min(1900).max(2100),
  order: z.coerce.number().int().default(0),
  isPublished: z.boolean(),
});

export type AwardFormState = { error?: string } | undefined;

export async function saveAwardAction(
  _prevState: AwardFormState,
  formData: FormData,
): Promise<AwardFormState> {
  const session = await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);

  const id = formData.get("id")?.toString() || undefined;
  const parsed = AwardSchema.safeParse({
    titleEn: formData.get("titleEn"),
    titleAr: formData.get("titleAr"),
    issuerEn: formData.get("issuerEn")?.toString() || undefined,
    issuerAr: formData.get("issuerAr")?.toString() || undefined,
    year: formData.get("year"),
    order: formData.get("order") || 0,
    isPublished: formData.get("isPublished") === "on",
  });

  if (!parsed.success) {
    return { error: "Please check the form fields." };
  }

  const logoFile = formData.get("logo") as File | null;
  const logoUrl = await uploadIfPresent(logoFile, "awards");

  const { issuerEn, issuerAr, ...rest } = parsed.data;
  const data = {
    ...rest,
    issuerEn: issuerEn || null,
    issuerAr: issuerAr || null,
    ...(logoUrl && { logoUrl }),
  };

  if (id) {
    await prisma.award.update({ where: { id }, data });
    await logAudit({
      userId: session.user.id,
      action: "AWARD_UPDATE",
      entityType: "Award",
      entityId: id,
      diff: data,
    });
  } else {
    const created = await prisma.award.create({ data });
    await logAudit({
      userId: session.user.id,
      action: "AWARD_CREATE",
      entityType: "Award",
      entityId: created.id,
      diff: data,
    });
  }

  revalidatePath("/[locale]/admin/awards", "page");
  revalidatePath("/[locale]/about", "page");
  redirect(`/admin/awards`);
}

export async function deleteAwardAction(id: string) {
  const session = await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  await prisma.award.delete({ where: { id } });
  await logAudit({
    userId: session.user.id,
    action: "AWARD_DELETE",
    entityType: "Award",
    entityId: id,
    diff: {},
  });
  revalidatePath("/[locale]/admin/awards", "page");
  revalidatePath("/[locale]/about", "page");
}
