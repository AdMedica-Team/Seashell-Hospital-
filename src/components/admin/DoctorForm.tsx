"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { saveDoctorAction } from "@/lib/actions/doctors";
import type { Department, Doctor, DoctorDepartment } from "@/generated/prisma/client";

type DoctorWithDepartments = Doctor & { departments: DoctorDepartment[] };

export function DoctorForm({
  doctor,
  departments,
}: {
  doctor?: DoctorWithDepartments;
  departments: Department[];
}) {
  const t = useTranslations("admin.doctors");
  const tc = useTranslations("admin.common");
  const [state, action, pending] = useActionState(saveDoctorAction, undefined);

  const initialSelected = new Set(doctor?.departments.map((d) => d.departmentId) ?? []);
  const initialPrimary = doctor?.departments.find((d) => d.isPrimary)?.departmentId ?? "";
  const [selectedDeptIds, setSelectedDeptIds] = useState<Set<string>>(initialSelected);
  const [primaryDeptId, setPrimaryDeptId] = useState(initialPrimary);

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-4">
      {doctor && <input type="hidden" name="id" value={doctor.id} />}

      <label className="flex flex-col gap-1 text-sm text-ink">
        {tc("slug")}
        <input name="slug" required defaultValue={doctor?.slug} className="rounded-lg border border-line px-3 py-2" />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {tc("nameEn")}
          <input name="nameEn" required defaultValue={doctor?.nameEn} className="rounded-lg border border-line px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink" dir="rtl">
          {tc("nameAr")}
          <input name="nameAr" required defaultValue={doctor?.nameAr} className="rounded-lg border border-line px-3 py-2" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {tc("titleEn")}
          <input name="titleEn" required defaultValue={doctor?.titleEn} className="rounded-lg border border-line px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink" dir="rtl">
          {tc("titleAr")}
          <input name="titleAr" required defaultValue={doctor?.titleAr} className="rounded-lg border border-line px-3 py-2" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {t("bioEn")}
          <textarea name="bioEn" required defaultValue={doctor?.bioEn} className="rounded-lg border border-line px-3 py-2" rows={3} />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink" dir="rtl">
          {t("bioAr")}
          <textarea name="bioAr" required defaultValue={doctor?.bioAr} className="rounded-lg border border-line px-3 py-2" rows={3} />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("photo")}
        <input name="photo" type="file" accept="image/*" className="rounded-lg border border-line px-3 py-2" />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("languages")}
        <input
          name="languages"
          defaultValue={doctor?.languages.join(", ") ?? ""}
          placeholder="English, Arabic"
          className="rounded-lg border border-line px-3 py-2"
        />
        <span className="text-xs text-muted">{t("languagesHint")}</span>
      </label>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-ink">{t("departments")}</p>
        <div className="flex flex-col gap-2 rounded-lg border border-line p-3">
          {departments.map((dept) => (
            <label key={dept.id} className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="departmentIds"
                value={dept.id}
                checked={selectedDeptIds.has(dept.id)}
                onChange={(event) => {
                  const next = new Set(selectedDeptIds);
                  if (event.target.checked) next.add(dept.id);
                  else {
                    next.delete(dept.id);
                    if (primaryDeptId === dept.id) setPrimaryDeptId("");
                  }
                  setSelectedDeptIds(next);
                }}
              />
              {dept.nameEn}
              {selectedDeptIds.has(dept.id) && (
                <label className="ms-2 flex items-center gap-1 text-xs text-muted">
                  <input
                    type="radio"
                    name="primaryDepartmentId"
                    value={dept.id}
                    checked={primaryDeptId === dept.id}
                    onChange={() => setPrimaryDeptId(dept.id)}
                  />
                  primary
                </label>
              )}
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" name="isFeatured" defaultChecked={doctor?.isFeatured} />
        {t("featured")}
      </label>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" name="isPublished" defaultChecked={doctor?.isPublished ?? false} />
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
