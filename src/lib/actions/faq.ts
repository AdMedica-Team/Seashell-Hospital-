"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { logAudit } from "@/lib/audit";

const FaqSchema = z.object({
  questionEn: z.string().min(2),
  questionAr: z.string().min(2),
  answerEn: z.string().min(2),
  answerAr: z.string().min(2),
  category: z.string().min(2),
  order: z.coerce.number().int().default(0),
  isPublished: z.boolean(),
});

export type FaqFormState = { error?: string } | undefined;

export async function saveFaqAction(
  _prevState: FaqFormState,
  formData: FormData,
): Promise<FaqFormState> {
  const session = await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);

  const id = formData.get("id")?.toString() || undefined;
  const parsed = FaqSchema.safeParse({
    questionEn: formData.get("questionEn"),
    questionAr: formData.get("questionAr"),
    answerEn: formData.get("answerEn"),
    answerAr: formData.get("answerAr"),
    category: formData.get("category"),
    order: formData.get("order") || 0,
    isPublished: formData.get("isPublished") === "on",
  });

  if (!parsed.success) {
    return { error: "Please check the form fields." };
  }

  if (id) {
    await prisma.fAQItem.update({ where: { id }, data: parsed.data });
    await logAudit({
      userId: session.user.id,
      action: "FAQ_UPDATE",
      entityType: "FAQItem",
      entityId: id,
      diff: parsed.data,
    });
  } else {
    const created = await prisma.fAQItem.create({ data: parsed.data });
    await logAudit({
      userId: session.user.id,
      action: "FAQ_CREATE",
      entityType: "FAQItem",
      entityId: created.id,
      diff: parsed.data,
    });
  }

  revalidatePath("/[locale]/admin/faq", "page");
  revalidatePath("/[locale]/faq", "page");
  redirect(`/admin/faq`);
}
