import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { requireRole } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { NewsForm } from "@/components/admin/NewsForm";
import type { NewsPost } from "@/generated/prisma/client";

export default async function EditNewsPage({ params }: PageProps<"/[locale]/admin/news/[id]">) {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  const { id } = await params;
  const post = await prisma.newsPost.findUnique({ where: { id } });
  if (!post) notFound();
  return <EditNewsContent post={post} />;
}

function EditNewsContent({ post }: { post: NewsPost }) {
  const t = useTranslations("admin.common");
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl text-ink">
        {t("edit")} · {post.titleEn}
      </h1>
      <div className="mt-6">
        <NewsForm post={post} />
      </div>
    </div>
  );
}
