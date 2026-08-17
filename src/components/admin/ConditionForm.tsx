"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { saveConditionAction } from "@/lib/actions/conditions";
import type {
  Condition,
  ConditionDepartment,
  ConditionDoctor,
  Department,
  Doctor,
} from "@/generated/prisma/client";

type ConditionWithLinks = Condition & {
  departments: ConditionDepartment[];
  doctors: ConditionDoctor[];
};

export function ConditionForm({
  condition,
  departments,
  doctors,
}: {
  condition?: ConditionWithLinks;
  departments: Department[];
  doctors: Doctor[];
}) {
  const t = useTranslations("admin.conditions");
  const tc = useTranslations("admin.common");
  const [state, action, pending] = useActionState(saveConditionAction, undefined);

  const [selectedDepts, setSelectedDepts] = useState<Set<string>>(
    new Set(condition?.departments.map((d) => d.departmentId) ?? []),
  );
  const [selectedDoctors, setSelectedDoctors] = useState<Set<string>>(
    new Set(condition?.doctors.map((d) => d.doctorId) ?? []),
  );

  const toggle = (set: Set<string>, setter: (s: Set<string>) => void, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setter(next);
  };

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-4">
      {condition && <input type="hidden" name="id" value={condition.id} />}

      <label className="flex flex-col gap-1 text-sm text-ink">
        {tc("slug")}
        <input name="slug" required defaultValue={condition?.slug} className="rounded-lg border border-line px-3 py-2" />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {tc("nameEn")}
          <input name="nameEn" required defaultValue={condition?.nameEn} className="rounded-lg border border-line px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink" dir="rtl">
          {tc("nameAr")}
          <input name="nameAr" required defaultValue={condition?.nameAr} className="rounded-lg border border-line px-3 py-2" />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-ink">{t("departments")}</p>
        <div className="flex flex-col gap-2 rounded-lg border border-line p-3">
          {departments.map((dept) => (
            <label key={dept.id} className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="departmentIds"
                value={dept.id}
                checked={selectedDepts.has(dept.id)}
                onChange={() => toggle(selectedDepts, setSelectedDepts, dept.id)}
              />
              {dept.nameEn}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-ink">{t("doctors")}</p>
        <div className="flex flex-col gap-2 rounded-lg border border-line p-3">
          {doctors.map((doctor) => (
            <label key={doctor.id} className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="doctorIds"
                value={doctor.id}
                checked={selectedDoctors.has(doctor.id)}
                onChange={() => toggle(selectedDoctors, setSelectedDoctors, doctor.id)}
              />
              {doctor.nameEn}
            </label>
          ))}
        </div>
      </div>

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
