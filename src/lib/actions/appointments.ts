"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { logAudit } from "@/lib/audit";

const AppointmentSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  departmentId: z.string().optional(),
  preferredDate: z.string().optional(),
  notes: z.string().optional(),
});

export type AppointmentFormState = { error?: string; success?: boolean } | undefined;

export async function submitAppointmentRequestAction(
  _prevState: AppointmentFormState,
  formData: FormData,
): Promise<AppointmentFormState> {
  const parsed = AppointmentSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    departmentId: formData.get("departmentId")?.toString() || undefined,
    preferredDate: formData.get("preferredDate")?.toString() || undefined,
    notes: formData.get("notes")?.toString() || undefined,
  });

  if (!parsed.success) {
    return { error: "Please fill in your name and a valid phone number." };
  }

  const { preferredDate, ...rest } = parsed.data;
  await prisma.appointmentRequest.create({
    data: { ...rest, preferredDate: preferredDate ? new Date(preferredDate) : null },
  });

  return { success: true };
}

export async function updateAppointmentStatusAction(id: string, status: string) {
  const session = await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  await prisma.appointmentRequest.update({ where: { id }, data: { status } });
  await logAudit({
    userId: session.user.id,
    action: "APPOINTMENT_STATUS_UPDATE",
    entityType: "AppointmentRequest",
    entityId: id,
    diff: { status },
  });
  revalidatePath("/[locale]/admin/appointments", "page");
}
