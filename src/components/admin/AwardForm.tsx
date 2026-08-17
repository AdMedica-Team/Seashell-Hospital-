"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { saveAwardAction } from "@/lib/actions/awards";
import type { Award } from "@/generated/prisma/client";

export function AwardForm({ award }: { award?: Award }) {
  const t = useTranslations("admin.awards");
  const tc = useTranslations("admin.common");
  const [state, action, pending] = useActionState(saveAwardAction, undefined);

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-4">
      {award && <input type="hidden" name="id" value={award.id} />}

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {tc("titleEn")}
          <input
            name="titleEn"
            required
            defaultValue={award?.titleEn}
            className="rounded-lg border border-line px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink" dir="rtl">
          {tc("titleAr")}
          <input
            name="titleAr"
            required
            defaultValue={award?.titleAr}
            className="rounded-lg border border-line px-3 py-2"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {t("issuerEn")}
          <input
            name="issuerEn"
            defaultValue={award?.issuerEn ?? ""}
            className="rounded-lg border border-line px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink" dir="rtl">
          {t("issuerAr")}
          <input
            name="issuerAr"
            defaultValue={award?.issuerAr ?? ""}
            className="rounded-lg border border-line px-3 py-2"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {t("year")}
          <input
            name="year"
            type="number"
            required
            min={1900}
            max={2100}
            defaultValue={award?.year ?? new Date().getFullYear()}
            className="w-40 rounded-lg border border-line px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink">
          {tc("order")}
          <input
            name="order"
            type="number"
            defaultValue={award?.order ?? 0}
            className="w-32 rounded-lg border border-line px-3 py-2"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("logo")}
        <input
          name="logo"
          type="file"
          accept="image/*"
          className="rounded-lg border border-line px-3 py-2"
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" name="isPublished" defaultChecked={award?.isPublished ?? true} />
        {tc("published")}
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

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
