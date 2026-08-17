"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { logAudit } from "@/lib/audit";

const ConditionSchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and dashes only."),
  nameEn: z.string().min(2),
  nameAr: z.string().min(2),
});

export type ConditionFormState = { error?: string } | undefined;

export async function saveConditionAction(
  _prevState: ConditionFormState,
  formData: FormData,
): Promise<ConditionFormState> {
  const session = await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);

  const id = formData.get("id")?.toString() || undefined;
  const parsed = ConditionSchema.safeParse({
    slug: formData.get("slug"),
    nameEn: formData.get("nameEn"),
    nameAr: formData.get("nameAr"),
  });

  if (!parsed.success) {
    return { error: "Please check the form fields." };
  }

  const departmentIds = formData.getAll("departmentIds").map(String);
  const doctorIds = formData.getAll("doctorIds").map(String);

  let conditionId = id;
  if (id) {
    await prisma.condition.update({ where: { id }, data: parsed.data });
    await prisma.conditionDepartment.deleteMany({ where: { conditionId: id } });
    await prisma.conditionDoctor.deleteMany({ where: { conditionId: id } });
    await logAudit({
      userId: session.user.id,
      action: "CONDITION_UPDATE",
      entityType: "Condition",
      entityId: id,
      diff: parsed.data,
    });
  } else {
    const existing = await prisma.condition.findUnique({ where: { slug: parsed.data.slug } });
    if (existing) return { error: "A condition with this slug already exists." };
    const created = await prisma.condition.create({ data: parsed.data });
    conditionId = created.id;
    await logAudit({
      userId: session.user.id,
      action: "CONDITION_CREATE",
      entityType: "Condition",
      entityId: created.id,
      diff: parsed.data,
    });
  }

  if (conditionId) {
    if (departmentIds.length > 0) {
      await prisma.conditionDepartment.createMany({
        data: departmentIds.map((departmentId) => ({ conditionId: conditionId as string, departmentId })),
      });
    }
    if (doctorIds.length > 0) {
      await prisma.conditionDoctor.createMany({
        data: doctorIds.map((doctorId) => ({ conditionId: conditionId as string, doctorId })),
      });
    }
  }

  revalidatePath("/[locale]/admin/conditions", "page");
  revalidatePath("/[locale]/doctors/find", "page");
  redirect(`/admin/conditions`);
}
