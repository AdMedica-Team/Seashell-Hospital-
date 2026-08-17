"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { saveSettingsAction } from "@/lib/actions/settings";
import type { SiteSettings } from "@/generated/prisma/client";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const t = useTranslations("admin.settings");
  const tc = useTranslations("admin.common");
  const [state, action, pending] = useActionState(saveSettingsAction, undefined);

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {t("emergencyNumber")}
          <input name="emergencyNumber" required defaultValue={settings.emergencyNumber} className="rounded-lg border border-line px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink">
          {t("hotlineNumber")}
          <input name="hotlineNumber" required defaultValue={settings.hotlineNumber} className="rounded-lg border border-line px-3 py-2" />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("whatsappNumber")}
        <input name="whatsappNumber" defaultValue={settings.whatsappNumber ?? ""} className="rounded-lg border border-line px-3 py-2" />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {t("addressEn")}
          <textarea name="addressEn" defaultValue={settings.addressEn} className="rounded-lg border border-line px-3 py-2" rows={2} />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink" dir="rtl">
          {t("addressAr")}
          <textarea name="addressAr" defaultValue={settings.addressAr} className="rounded-lg border border-line px-3 py-2" rows={2} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {t("workingHoursEn")}
          <textarea name="workingHoursEn" defaultValue={settings.workingHoursEn} className="rounded-lg border border-line px-3 py-2" rows={2} />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink" dir="rtl">
          {t("workingHoursAr")}
          <textarea name="workingHoursAr" defaultValue={settings.workingHoursAr} className="rounded-lg border border-line px-3 py-2" rows={2} />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("mapEmbedUrl")}
        <input name="mapEmbedUrl" defaultValue={settings.mapEmbedUrl ?? ""} className="rounded-lg border border-line px-3 py-2" />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {t("patientRightsEn")}
          <textarea name="patientRightsEn" defaultValue={settings.patientRightsEn} className="rounded-lg border border-line px-3 py-2" rows={4} />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink" dir="rtl">
          {t("patientRightsAr")}
          <textarea name="patientRightsAr" defaultValue={settings.patientRightsAr} className="rounded-lg border border-line px-3 py-2" rows={4} />
        </label>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-teal">{t("saved")}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-fit rounded-full bg-teal px-6 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? tc("saving") : tc("save")}
      </button>
    </form>
  );
}
