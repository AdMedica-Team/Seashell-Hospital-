"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { saveTestimonialAction } from "@/lib/actions/testimonials";
import type { Testimonial } from "@/generated/prisma/client";

export function TestimonialForm({ testimonial }: { testimonial?: Testimonial }) {
  const t = useTranslations("admin.testimonials");
  const tc = useTranslations("admin.common");
  const [state, action, pending] = useActionState(saveTestimonialAction, undefined);

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-4">
      {testimonial && <input type="hidden" name="id" value={testimonial.id} />}

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {t("displayNameEn")}
          <input
            name="displayNameEn"
            required
            defaultValue={testimonial?.displayNameEn}
            className="rounded-lg border border-line px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink" dir="rtl">
          {t("displayNameAr")}
          <input
            name="displayNameAr"
            required
            defaultValue={testimonial?.displayNameAr}
            className="rounded-lg border border-line px-3 py-2"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {t("quoteEn")}
          <textarea
            name="quoteEn"
            rows={4}
            defaultValue={testimonial?.quoteEn ?? ""}
            className="rounded-lg border border-line px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink" dir="rtl">
          {t("quoteAr")}
          <textarea
            name="quoteAr"
            rows={4}
            defaultValue={testimonial?.quoteAr ?? ""}
            className="rounded-lg border border-line px-3 py-2"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("videoUrl")}
        <input
          name="videoUrl"
          type="url"
          placeholder="https://…"
          defaultValue={testimonial?.videoUrl ?? ""}
          className="rounded-lg border border-line px-3 py-2"
        />
        <span className="text-xs text-muted">{t("videoHint")}</span>
      </label>

      <div className="grid grid-cols-2 gap-4">
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
          {t("rating")}
          <input
            name="rating"
            type="number"
            min={1}
            max={5}
            defaultValue={testimonial?.rating ?? ""}
            className="w-32 rounded-lg border border-line px-3 py-2"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-ink">
        {tc("order")}
        <input
          name="order"
          type="number"
          defaultValue={testimonial?.order ?? 0}
          className="w-32 rounded-lg border border-line px-3 py-2"
        />
      </label>

      <label className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-ink">
        <input
          type="checkbox"
          name="consentObtained"
          defaultChecked={testimonial?.consentObtained ?? false}
          className="mt-1"
        />
        <span>
          <span className="font-medium">{t("consent")}</span>
          <span className="mt-1 block text-xs text-muted">{t("consentHint")}</span>
        </span>
      </label>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={testimonial?.isPublished ?? false}
        />
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
