"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { logAudit } from "@/lib/audit";
import { uploadIfPresent } from "@/lib/storage";

const TestimonialSchema = z.object({
  displayNameEn: z.string().min(2),
  displayNameAr: z.string().min(2),
  quoteEn: z.string().optional(),
  quoteAr: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  consentObtained: z.boolean(),
  isPublished: z.boolean(),
  order: z.coerce.number().int().default(0),
});

export type TestimonialFormState = { error?: string } | undefined;

export async function saveTestimonialAction(
  _prevState: TestimonialFormState,
  formData: FormData,
): Promise<TestimonialFormState> {
  const session = await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);

  const id = formData.get("id")?.toString() || undefined;
  const parsed = TestimonialSchema.safeParse({
    displayNameEn: formData.get("displayNameEn"),
    displayNameAr: formData.get("displayNameAr"),
    quoteEn: formData.get("quoteEn")?.toString() || undefined,
    quoteAr: formData.get("quoteAr")?.toString() || undefined,
    videoUrl: formData.get("videoUrl")?.toString() || "",
    rating: formData.get("rating") || undefined,
    consentObtained: formData.get("consentObtained") === "on",
    isPublished: formData.get("isPublished") === "on",
    order: formData.get("order") || 0,
  });

  if (!parsed.success) {
    return { error: "Please check the form fields." };
  }

  // Consent gate: a testimonial can never be published without explicit consent on file.
  if (parsed.data.isPublished && !parsed.data.consentObtained) {
    return { error: "Consent must be obtained before a testimonial can be published." };
  }

  // Require at least a written quote or a video.
  if (!parsed.data.quoteEn && !parsed.data.quoteAr && !parsed.data.videoUrl) {
    return { error: "Add a written quote or a video URL." };
  }

  const photoFile = formData.get("photo") as File | null;
  const photoUrl = await uploadIfPresent(photoFile, "testimonials");

  const { videoUrl, quoteEn, quoteAr, rating, ...rest } = parsed.data;
  const data = {
    ...rest,
    quoteEn: quoteEn || null,
    quoteAr: quoteAr || null,
    rating: rating ?? null,
    videoUrl: videoUrl || null,
    ...(photoUrl && { photoUrl }),
  };

  if (id) {
    await prisma.testimonial.update({ where: { id }, data });
    await logAudit({
      userId: session.user.id,
      action: "TESTIMONIAL_UPDATE",
      entityType: "Testimonial",
      entityId: id,
      diff: data,
    });
  } else {
    const created = await prisma.testimonial.create({ data });
    await logAudit({
      userId: session.user.id,
      action: "TESTIMONIAL_CREATE",
      entityType: "Testimonial",
      entityId: created.id,
      diff: data,
    });
  }

  revalidatePath("/[locale]/admin/testimonials", "page");
  revalidatePath("/[locale]/testimonials", "page");
  redirect(`/admin/testimonials`);
}

export async function deleteTestimonialAction(id: string) {
  const session = await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  await prisma.testimonial.delete({ where: { id } });
  await logAudit({
    userId: session.user.id,
    action: "TESTIMONIAL_DELETE",
    entityType: "Testimonial",
    entityId: id,
    diff: {},
  });
  revalidatePath("/[locale]/admin/testimonials", "page");
  revalidatePath("/[locale]/testimonials", "page");
}
