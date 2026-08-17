"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { saveFaqAction } from "@/lib/actions/faq";
import type { FAQItem } from "@/generated/prisma/client";

export function FaqForm({ faq }: { faq?: FAQItem }) {
  const t = useTranslations("admin.faq");
  const tc = useTranslations("admin.common");
  const [state, action, pending] = useActionState(saveFaqAction, undefined);

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-4">
      {faq && <input type="hidden" name="id" value={faq.id} />}

      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("category")}
        <input name="category" required defaultValue={faq?.category} className="rounded-lg border border-line px-3 py-2" />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {t("questionEn")}
          <input name="questionEn" required defaultValue={faq?.questionEn} className="rounded-lg border border-line px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink" dir="rtl">
          {t("questionAr")}
          <input name="questionAr" required defaultValue={faq?.questionAr} className="rounded-lg border border-line px-3 py-2" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {t("answerEn")}
          <textarea name="answerEn" required defaultValue={faq?.answerEn} className="rounded-lg border border-line px-3 py-2" rows={3} />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink" dir="rtl">
          {t("answerAr")}
          <textarea name="answerAr" required defaultValue={faq?.answerAr} className="rounded-lg border border-line px-3 py-2" rows={3} />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-ink">
        {tc("order")}
        <input name="order" type="number" defaultValue={faq?.order ?? 0} className="w-32 rounded-lg border border-line px-3 py-2" />
      </label>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" name="isPublished" defaultChecked={faq?.isPublished ?? true} />
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
