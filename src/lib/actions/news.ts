"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { logAudit } from "@/lib/audit";
import { uploadIfPresent } from "@/lib/storage";

const NewsSchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and dashes only."),
  titleEn: z.string().min(2),
  titleAr: z.string().min(2),
  excerptEn: z.string().min(2),
  excerptAr: z.string().min(2),
  bodyEn: z.string().min(2),
  bodyAr: z.string().min(2),
  publishedAt: z.string().optional(),
  isPublished: z.boolean(),
});

export type NewsFormState = { error?: string } | undefined;

export async function saveNewsAction(
  _prevState: NewsFormState,
  formData: FormData,
): Promise<NewsFormState> {
  const session = await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);

  const id = formData.get("id")?.toString() || undefined;
  const parsed = NewsSchema.safeParse({
    slug: formData.get("slug"),
    titleEn: formData.get("titleEn"),
    titleAr: formData.get("titleAr"),
    excerptEn: formData.get("excerptEn"),
    excerptAr: formData.get("excerptAr"),
    bodyEn: formData.get("bodyEn"),
    bodyAr: formData.get("bodyAr"),
    publishedAt: formData.get("publishedAt")?.toString() || undefined,
    isPublished: formData.get("isPublished") === "on",
  });

  if (!parsed.success) {
    return { error: "Please check the form fields." };
  }

  const coverFile = formData.get("cover") as File | null;
  const coverImageUrl = await uploadIfPresent(coverFile, "news");

  const { publishedAt, isPublished, ...rest } = parsed.data;
  // When publishing without an explicit date, stamp "now"; unpublished posts keep a null date.
  const resolvedPublishedAt = publishedAt
    ? new Date(publishedAt)
    : isPublished
      ? new Date()
      : null;
  const data = {
    ...rest,
    isPublished,
    publishedAt: resolvedPublishedAt,
    ...(coverImageUrl && { coverImageUrl }),
  };

  if (id) {
    await prisma.newsPost.update({ where: { id }, data });
    await logAudit({
      userId: session.user.id,
      action: "NEWS_UPDATE",
      entityType: "NewsPost",
      entityId: id,
      diff: data,
    });
  } else {
    const existing = await prisma.newsPost.findUnique({ where: { slug: parsed.data.slug } });
    if (existing) return { error: "A news post with this slug already exists." };
    const created = await prisma.newsPost.create({ data });
    await logAudit({
      userId: session.user.id,
      action: "NEWS_CREATE",
      entityType: "NewsPost",
      entityId: created.id,
      diff: data,
    });
  }

  revalidatePath("/[locale]/admin/news", "page");
  revalidatePath("/[locale]/news", "page");
  redirect(`/admin/news`);
}

export async function deleteNewsAction(id: string) {
  const session = await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  await prisma.newsPost.delete({ where: { id } });
  await logAudit({
    userId: session.user.id,
    action: "NEWS_DELETE",
    entityType: "NewsPost",
    entityId: id,
    diff: {},
  });
  revalidatePath("/[locale]/admin/news", "page");
  revalidatePath("/[locale]/news", "page");
}
