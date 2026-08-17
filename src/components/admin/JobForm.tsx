"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { saveJobAction } from "@/lib/actions/careers";
import type { JobOpening } from "@/generated/prisma/client";

export function JobForm({ job }: { job?: JobOpening }) {
  const t = useTranslations("admin.careers");
  const tc = useTranslations("admin.common");
  const [state, action, pending] = useActionState(saveJobAction, undefined);

  const closesAtValue = job?.closesAt
    ? new Date(job.closesAt).toISOString().slice(0, 10)
    : "";

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-4">
      {job && <input type="hidden" name="id" value={job.id} />}

      <label className="flex flex-col gap-1 text-sm text-ink">
        {tc("slug")}
        <input name="slug" required defaultValue={job?.slug} className="rounded-lg border border-line px-3 py-2" />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {tc("titleEn")}
          <input name="titleEn" required defaultValue={job?.titleEn} className="rounded-lg border border-line px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink" dir="rtl">
          {tc("titleAr")}
          <input name="titleAr" required defaultValue={job?.titleAr} className="rounded-lg border border-line px-3 py-2" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {t("descriptionEn")}
          <textarea name="descriptionEn" required defaultValue={job?.descriptionEn} className="rounded-lg border border-line px-3 py-2" rows={4} />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink" dir="rtl">
          {t("descriptionAr")}
          <textarea name="descriptionAr" required defaultValue={job?.descriptionAr} className="rounded-lg border border-line px-3 py-2" rows={4} />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("closesAt")}
        <input name="closesAt" type="date" defaultValue={closesAtValue} className="w-48 rounded-lg border border-line px-3 py-2" />
      </label>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" name="isOpen" defaultChecked={job?.isOpen ?? true} />
        {t("open")}
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
