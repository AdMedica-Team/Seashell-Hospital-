"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { logAudit } from "@/lib/audit";
import { uploadIfPresent } from "@/lib/storage";

const DoctorSchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and dashes only."),
  nameEn: z.string().min(2),
  nameAr: z.string().min(2),
  titleEn: z.string().min(2),
  titleAr: z.string().min(2),
  bioEn: z.string().min(2),
  bioAr: z.string().min(2),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
});

export type DoctorFormState = { error?: string } | undefined;

export async function saveDoctorAction(
  _prevState: DoctorFormState,
  formData: FormData,
): Promise<DoctorFormState> {
  const session = await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);

  const id = formData.get("id")?.toString() || undefined;
  const parsed = DoctorSchema.safeParse({
    slug: formData.get("slug"),
    nameEn: formData.get("nameEn"),
    nameAr: formData.get("nameAr"),
    titleEn: formData.get("titleEn"),
    titleAr: formData.get("titleAr"),
    bioEn: formData.get("bioEn"),
    bioAr: formData.get("bioAr"),
    isFeatured: formData.get("isFeatured") === "on",
    isPublished: formData.get("isPublished") === "on",
  });

  if (!parsed.success) {
    return { error: "Please check the form fields." };
  }

  const languages = (formData.get("languages")?.toString() ?? "")
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean);

  const departmentIds = formData.getAll("departmentIds").map(String);
  const primaryDepartmentId = formData.get("primaryDepartmentId")?.toString() || undefined;

  const photoFile = formData.get("photo") as File | null;
  const photoUrl = await uploadIfPresent(photoFile, "doctors");

  const data = {
    ...parsed.data,
    languages,
    ...(photoUrl && { photoUrl }),
  };

  let doctorId = id;
  if (id) {
    await prisma.doctor.update({ where: { id }, data });
    await prisma.doctorDepartment.deleteMany({ where: { doctorId: id } });
    await logAudit({
      userId: session.user.id,
      action: "DOCTOR_UPDATE",
      entityType: "Doctor",
      entityId: id,
      diff: data,
    });
  } else {
    const existing = await prisma.doctor.findUnique({ where: { slug: parsed.data.slug } });
    if (existing) return { error: "A doctor with this slug already exists." };
    const created = await prisma.doctor.create({ data });
    doctorId = created.id;
    await logAudit({
      userId: session.user.id,
      action: "DOCTOR_CREATE",
      entityType: "Doctor",
      entityId: created.id,
      diff: data,
    });
  }

  if (departmentIds.length > 0 && doctorId) {
    await prisma.doctorDepartment.createMany({
      data: departmentIds.map((departmentId) => ({
        doctorId: doctorId as string,
        departmentId,
        isPrimary: departmentId === primaryDepartmentId,
      })),
    });
  }

  revalidatePath("/[locale]/admin/doctors", "page");
  revalidatePath("/[locale]/doctors", "page");
  redirect(`/admin/doctors`);
}

export async function deleteDoctorAction(id: string) {
  const session = await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  await prisma.doctor.delete({ where: { id } });
  await logAudit({
    userId: session.user.id,
    action: "DOCTOR_DELETE",
    entityType: "Doctor",
    entityId: id,
    diff: {},
  });
  revalidatePath("/[locale]/admin/doctors", "page");
  revalidatePath("/[locale]/doctors", "page");
}
