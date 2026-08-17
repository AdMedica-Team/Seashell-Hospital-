"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { saveNewsAction } from "@/lib/actions/news";
import type { NewsPost } from "@/generated/prisma/client";

export function NewsForm({ post }: { post?: NewsPost }) {
  const t = useTranslations("admin.news");
  const tc = useTranslations("admin.common");
  const [state, action, pending] = useActionState(saveNewsAction, undefined);

  const publishedAtValue = post?.publishedAt
    ? new Date(post.publishedAt).toISOString().slice(0, 10)
    : "";

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-4">
      {post && <input type="hidden" name="id" value={post.id} />}

      <label className="flex flex-col gap-1 text-sm text-ink">
        {tc("slug")}
        <input
          name="slug"
          required
          defaultValue={post?.slug}
          className="rounded-lg border border-line px-3 py-2"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {tc("titleEn")}
          <input
            name="titleEn"
            required
            defaultValue={post?.titleEn}
            className="rounded-lg border border-line px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink" dir="rtl">
          {tc("titleAr")}
          <input
            name="titleAr"
            required
            defaultValue={post?.titleAr}
            className="rounded-lg border border-line px-3 py-2"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {t("excerptEn")}
          <textarea
            name="excerptEn"
            required
            rows={3}
            defaultValue={post?.excerptEn}
            className="rounded-lg border border-line px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink" dir="rtl">
          {t("excerptAr")}
          <textarea
            name="excerptAr"
            required
            rows={3}
            defaultValue={post?.excerptAr}
            className="rounded-lg border border-line px-3 py-2"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink">
          {t("bodyEn")}
          <textarea
            name="bodyEn"
            required
            rows={8}
            defaultValue={post?.bodyEn}
            className="rounded-lg border border-line px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink" dir="rtl">
          {t("bodyAr")}
          <textarea
            name="bodyAr"
            required
            rows={8}
            defaultValue={post?.bodyAr}
            className="rounded-lg border border-line px-3 py-2"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("cover")}
        <input
          name="cover"
          type="file"
          accept="image/*"
          className="rounded-lg border border-line px-3 py-2"
        />
        {post?.coverImageUrl && (
          <span className="text-xs text-muted">{t("currentImage")}</span>
        )}
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("publishedAt")}
        <input
          name="publishedAt"
          type="date"
          defaultValue={publishedAtValue}
          className="w-48 rounded-lg border border-line px-3 py-2"
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" name="isPublished" defaultChecked={post?.isPublished ?? false} />
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
