"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { saveLeadershipAction } from "@/lib/actions/leadership";
import type { LeadershipMember } from "@/generated/prisma/client";

export function LeadershipForm({ member }: { member?: LeadershipMember }) {
  const t = useTranslations("admin.leadership");
  const tc = useTranslations("admin.common");
  const [state, action, pending] = useActionState(saveLeadershipAction, undefined);

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-4">
      {member && <input type="hidden" name="id" value={member.id} />}

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {tc("nameEn")}
          <input
            name="nameEn"
            required
            defaultValue={member?.nameEn}
            className="rounded-lg border border-line px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink" dir="rtl">
          {tc("nameAr")}
          <input
            name="nameAr"
            required
            defaultValue={member?.nameAr}
            className="rounded-lg border border-line px-3 py-2"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {tc("titleEn")}
          <input
            name="titleEn"
            required
            defaultValue={member?.titleEn}
            className="rounded-lg border border-line px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink" dir="rtl">
          {tc("titleAr")}
          <input
            name="titleAr"
            required
            defaultValue={member?.titleAr}
            className="rounded-lg border border-line px-3 py-2"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {t("bioEn")}
          <textarea
            name="bioEn"
            required
            rows={5}
            defaultValue={member?.bioEn}
            className="rounded-lg border border-line px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink" dir="rtl">
          {t("bioAr")}
          <textarea
            name="bioAr"
            required
            rows={5}
            defaultValue={member?.bioAr}
            className="rounded-lg border border-line px-3 py-2"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("photo")}
        <input
          name="photo"
          type="file"
          accept="image/*"
          className="rounded-lg border border-line px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink">
        {tc("order")}
        <input
          name="order"
          type="number"
          defaultValue={member?.order ?? 0}
          className="w-32 rounded-lg border border-line px-3 py-2"
        />
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
