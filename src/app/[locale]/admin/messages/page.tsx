import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { markMessageHandledAction } from "@/lib/actions/contact";
import type { ContactMessage } from "@/generated/prisma/client";

export default async function AdminMessagesPage() {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return <MessagesList messages={messages} />;
}

function MessagesList({ messages }: { messages: ContactMessage[] }) {
  const t = useTranslations("admin.messages");

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl text-ink">{t("title")}</h1>
      <div className="mt-6 flex flex-col gap-3">
        {messages.length === 0 && <p className="text-sm text-muted">{t("empty")}</p>}
        {messages.map((message) => (
          <div key={message.id} className="rounded-xl border border-line bg-white p-4 text-sm">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>
                {t("from")}: {message.name} ({message.email}
                {message.phone ? `, ${message.phone}` : ""})
              </span>
              <span>{new Date(message.createdAt).toLocaleString()}</span>
            </div>
            <p className="mt-2 text-ink">{message.message}</p>
            <div className="mt-2 flex items-center gap-3">
              <span className={message.status === "NEW" ? "text-teal" : "text-muted"}>
                {message.status === "NEW" ? t("statusNew") : t("statusHandled")}
              </span>
              {message.status === "NEW" && (
                <form action={markMessageHandledAction.bind(null, message.id)}>
                  <button type="submit" className="rounded-full border border-line px-3 py-1 text-xs">
                    {t("markHandled")}
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
