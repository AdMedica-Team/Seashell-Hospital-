"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { logAudit } from "@/lib/audit";
import { uploadIfPresent } from "@/lib/storage";

const DepartmentSchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and dashes only."),
  nameEn: z.string().min(2),
  nameAr: z.string().min(2),
  summaryEn: z.string().min(2),
  summaryAr: z.string().min(2),
  descriptionEn: z.string().min(2),
  descriptionAr: z.string().min(2),
  isCenterOfExcellence: z.boolean(),
  coeBlurbEn: z.string().optional(),
  coeBlurbAr: z.string().optional(),
  bookingSpecialtyCode: z.string().optional(),
  isPublished: z.boolean(),
  order: z.coerce.number().int().default(0),
});

export type DepartmentFormState = { error?: string } | undefined;

function parseProcedures(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [nameEn, nameAr] = line.split("|").map((s) => s.trim());
      return { nameEn: nameEn ?? line, nameAr: nameAr ?? nameEn ?? line, order: index };
    });
}

export async function saveDepartmentAction(
  _prevState: DepartmentFormState,
  formData: FormData,
): Promise<DepartmentFormState> {
  const session = await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);

  const id = formData.get("id")?.toString() || undefined;
  const parsed = DepartmentSchema.safeParse({
    slug: formData.get("slug"),
    nameEn: formData.get("nameEn"),
    nameAr: formData.get("nameAr"),
    summaryEn: formData.get("summaryEn"),
    summaryAr: formData.get("summaryAr"),
    descriptionEn: formData.get("descriptionEn"),
    descriptionAr: formData.get("descriptionAr"),
    isCenterOfExcellence: formData.get("isCenterOfExcellence") === "on",
    coeBlurbEn: formData.get("coeBlurbEn")?.toString() || undefined,
    coeBlurbAr: formData.get("coeBlurbAr")?.toString() || undefined,
    bookingSpecialtyCode: formData.get("bookingSpecialtyCode")?.toString() || undefined,
    isPublished: formData.get("isPublished") === "on",
    order: formData.get("order") || 0,
  });

  if (!parsed.success) {
    return { error: "Please check the form fields." };
  }

  const heroImageFile = formData.get("heroImage") as File | null;
  const coeImageFile = formData.get("coeImage") as File | null;
  const heroImageUrl = await uploadIfPresent(heroImageFile, "departments");
  const coeImageUrl = await uploadIfPresent(coeImageFile, "departments");

  const procedures = parseProcedures(formData.get("procedures")?.toString() ?? "");

  const data = {
    ...parsed.data,
    ...(heroImageUrl && { heroImageUrl }),
    ...(coeImageUrl && { coeImageUrl }),
  };

  let departmentId = id;
  if (id) {
    await prisma.department.update({ where: { id }, data });
    await prisma.departmentProcedure.deleteMany({ where: { departmentId: id } });
    await logAudit({
      userId: session.user.id,
      action: "DEPARTMENT_UPDATE",
      entityType: "Department",
      entityId: id,
      diff: data,
    });
  } else {
    const existing = await prisma.department.findUnique({ where: { slug: parsed.data.slug } });
    if (existing) return { error: "A department with this slug already exists." };
    const created = await prisma.department.create({ data });
    departmentId = created.id;
    await logAudit({
      userId: session.user.id,
      action: "DEPARTMENT_CREATE",
      entityType: "Department",
      entityId: created.id,
      diff: data,
    });
  }

  if (procedures.length > 0 && departmentId) {
    await prisma.departmentProcedure.createMany({
      data: procedures.map((p) => ({ ...p, departmentId: departmentId as string })),
    });
  }

  revalidatePath("/[locale]/admin/departments", "page");
  revalidatePath("/[locale]/departments", "page");
  redirect(`/admin/departments`);
}

export async function deleteDepartmentAction(id: string) {
  const session = await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  await prisma.department.delete({ where: { id } });
  await logAudit({
    userId: session.user.id,
    action: "DEPARTMENT_DELETE",
    entityType: "Department",
    entityId: id,
    diff: {},
  });
  revalidatePath("/[locale]/admin/departments", "page");
  revalidatePath("/[locale]/departments", "page");
}
