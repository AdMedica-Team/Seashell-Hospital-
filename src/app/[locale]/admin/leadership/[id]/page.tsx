import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { requireRole } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { LeadershipForm } from "@/components/admin/LeadershipForm";
import type { LeadershipMember } from "@/generated/prisma/client";

export default async function EditLeadershipPage({
  params,
}: PageProps<"/[locale]/admin/leadership/[id]">) {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  const { id } = await params;
  const member = await prisma.leadershipMember.findUnique({ where: { id } });
  if (!member) notFound();
  return <EditLeadershipContent member={member} />;
}

function EditLeadershipContent({ member }: { member: LeadershipMember }) {
  const t = useTranslations("admin.common");
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl text-ink">
        {t("edit")} · {member.nameEn}
      </h1>
      <div className="mt-6">
        <LeadershipForm member={member} />
      </div>
    </div>
  );
}
