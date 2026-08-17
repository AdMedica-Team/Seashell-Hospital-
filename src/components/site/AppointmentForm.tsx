"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { submitAppointmentRequestAction } from "@/lib/actions/appointments";
import { pick } from "@/lib/i18n-content";

type DepartmentOption = { id: string; slug: string; nameEn: string; nameAr: string };

export function AppointmentForm({
  departments,
  defaultDepartmentId,
  locale,
}: {
  departments: DepartmentOption[];
  defaultDepartmentId?: string;
  locale: string;
}) {
  const t = useTranslations("pages.appointment");
  const [state, action, pending] = useActionState(submitAppointmentRequestAction, undefined);

  if (state?.success) {
    return <p className="rounded-xl border border-line bg-mint p-4 text-sm text-ink">{t("success")}</p>;
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("name")}
        <input name="name" required className="rounded-lg border border-line px-3 py-2" />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("phone")}
        <input name="phone" type="tel" required className="rounded-lg border border-line px-3 py-2" />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("department")}
        <select name="departmentId" defaultValue={defaultDepartmentId ?? ""} className="rounded-lg border border-line px-3 py-2">
          <option value="">{t("chooseDepartment")}</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {pick(dept.nameEn, dept.nameAr, locale)}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("preferredDate")}
        <input name="preferredDate" type="date" className="rounded-lg border border-line px-3 py-2" />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("notes")}
        <textarea name="notes" rows={3} className="rounded-lg border border-line px-3 py-2" />
      </label>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-fit rounded-full bg-teal px-6 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
