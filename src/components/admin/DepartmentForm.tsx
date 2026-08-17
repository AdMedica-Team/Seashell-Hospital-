"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { saveDepartmentAction } from "@/lib/actions/departments";
import type { Department, DepartmentProcedure } from "@/generated/prisma/client";

type DepartmentWithProcedures = Department & { procedures: DepartmentProcedure[] };

export function DepartmentForm({
  department,
}: {
  department?: DepartmentWithProcedures;
}) {
  const t = useTranslations("admin.departments");
  const tc = useTranslations("admin.common");
  const [state, action, pending] = useActionState(saveDepartmentAction, undefined);

  const proceduresText =
    department?.procedures
      .map((p) => `${p.nameEn} | ${p.nameAr}`)
      .join("\n") ?? "";

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-4">
      {department && <input type="hidden" name="id" value={department.id} />}

      <label className="flex flex-col gap-1 text-sm text-ink">
        {tc("slug")}
        <input
          name="slug"
          required
          defaultValue={department?.slug}
          className="rounded-lg border border-line px-3 py-2"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {tc("nameEn")}
          <input name="nameEn" required defaultValue={department?.nameEn} className="rounded-lg border border-line px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink" dir="rtl">
          {tc("nameAr")}
          <input name="nameAr" required defaultValue={department?.nameAr} className="rounded-lg border border-line px-3 py-2" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {tc("summaryEn")}
          <textarea name="summaryEn" required defaultValue={department?.summaryEn} className="rounded-lg border border-line px-3 py-2" rows={2} />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink" dir="rtl">
          {tc("summaryAr")}
          <textarea name="summaryAr" required defaultValue={department?.summaryAr} className="rounded-lg border border-line px-3 py-2" rows={2} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {tc("descriptionEn")}
          <textarea name="descriptionEn" required defaultValue={department?.descriptionEn} className="rounded-lg border border-line px-3 py-2" rows={4} />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink" dir="rtl">
          {tc("descriptionAr")}
          <textarea name="descriptionAr" required defaultValue={department?.descriptionAr} className="rounded-lg border border-line px-3 py-2" rows={4} />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("heroImage")}
        <input name="heroImage" type="file" accept="image/*" className="rounded-lg border border-line px-3 py-2" />
      </label>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" name="isCenterOfExcellence" defaultChecked={department?.isCenterOfExcellence} />
        {t("isCenterOfExcellence")}
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {t("coeBlurbEn")}
          <textarea name="coeBlurbEn" defaultValue={department?.coeBlurbEn ?? ""} className="rounded-lg border border-line px-3 py-2" rows={2} />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink" dir="rtl">
          {t("coeBlurbAr")}
          <textarea name="coeBlurbAr" defaultValue={department?.coeBlurbAr ?? ""} className="rounded-lg border border-line px-3 py-2" rows={2} />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("coeImage")}
        <input name="coeImage" type="file" accept="image/*" className="rounded-lg border border-line px-3 py-2" />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("bookingCode")}
        <input name="bookingSpecialtyCode" defaultValue={department?.bookingSpecialtyCode ?? ""} className="rounded-lg border border-line px-3 py-2" />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("procedures")}
        <textarea
          name="procedures"
          defaultValue={proceduresText}
          className="rounded-lg border border-line px-3 py-2 font-mono text-xs"
          rows={5}
          placeholder="Cardiac catheterization | قسطرة قلبية"
        />
        <span className="text-xs text-muted">{t("proceduresHint")}</span>
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink">
        {tc("order")}
        <input name="order" type="number" defaultValue={department?.order ?? 0} className="w-32 rounded-lg border border-line px-3 py-2" />
      </label>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" name="isPublished" defaultChecked={department?.isPublished ?? false} />
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
