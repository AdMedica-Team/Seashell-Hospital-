"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { logAudit } from "@/lib/audit";
import { getSiteSettings } from "@/lib/settings";

const SettingsSchema = z.object({
  emergencyNumber: z.string().min(1),
  hotlineNumber: z.string().min(1),
  whatsappNumber: z.string().optional(),
  addressEn: z.string(),
  addressAr: z.string(),
  workingHoursEn: z.string(),
  workingHoursAr: z.string(),
  mapEmbedUrl: z.string().optional(),
  patientRightsEn: z.string(),
  patientRightsAr: z.string(),
});

export type SettingsFormState = { error?: string; success?: boolean } | undefined;

export async function saveSettingsAction(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const session = await requireRole(["MARKETING_ADMIN", "SUPER_ADMIN"]);

  const parsed = SettingsSchema.safeParse({
    emergencyNumber: formData.get("emergencyNumber"),
    hotlineNumber: formData.get("hotlineNumber"),
    whatsappNumber: formData.get("whatsappNumber")?.toString() || undefined,
    addressEn: formData.get("addressEn"),
    addressAr: formData.get("addressAr"),
    workingHoursEn: formData.get("workingHoursEn"),
    workingHoursAr: formData.get("workingHoursAr"),
    mapEmbedUrl: formData.get("mapEmbedUrl")?.toString() || undefined,
    patientRightsEn: formData.get("patientRightsEn"),
    patientRightsAr: formData.get("patientRightsAr"),
  });

  if (!parsed.success) {
    return { error: "Please check the form fields." };
  }

  const settings = await getSiteSettings();
  await prisma.siteSettings.update({ where: { id: settings.id }, data: parsed.data });

  await logAudit({
    userId: session.user.id,
    action: "SETTINGS_UPDATE",
    entityType: "SiteSettings",
    entityId: settings.id,
    diff: parsed.data,
  });

  revalidatePath("/[locale]/admin/settings", "page");
  revalidatePath("/[locale]/contact", "page");
  return { success: true };
}
