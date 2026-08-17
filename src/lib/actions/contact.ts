"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { logAudit } from "@/lib/audit";

const ContactSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  phone: z.string().optional(),
  message: z.string().min(5),
});

export type ContactFormState = { error?: string; success?: boolean } | undefined;

export async function submitContactMessageAction(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = ContactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone")?.toString() || undefined,
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { error: "Please fill in all required fields with a valid email." };
  }

  await prisma.contactMessage.create({ data: parsed.data });
  return { success: true };
}

export async function markMessageHandledAction(id: string) {
  const session = await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  await prisma.contactMessage.update({ where: { id }, data: { status: "HANDLED" } });
  await logAudit({
    userId: session.user.id,
    action: "CONTACT_MESSAGE_HANDLED",
    entityType: "ContactMessage",
    entityId: id,
    diff: { status: "HANDLED" },
  });
  revalidatePath("/[locale]/admin/messages", "page");
}
