import type { Session } from "next-auth";
import { useTranslations } from "next-intl";
import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function AdminLayout({
  children,
}: LayoutProps<"/[locale]/admin">) {
  const session = await auth();

  return <AdminChrome session={session}>{children}</AdminChrome>;
}

function AdminChrome({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  const t = useTranslations("admin");

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f6f7]">
      <header className="flex items-center justify-between gap-4 border-b border-line bg-[#1f396b] px-4 py-3 text-white sm:px-6">
        <Link href="/admin/dashboard" className="font-display text-lg">
          {t("brand")} <span className="text-xs font-normal opacity-70">{t("brandSub")}</span>
        </Link>
        {session?.user && (
          <nav className="flex flex-wrap items-center gap-4 text-sm">
            <Link href="/admin/dashboard" className="opacity-90 hover:opacity-100">
              {t("nav.dashboard")}
            </Link>
            <Link href="/admin/departments" className="opacity-90 hover:opacity-100">
              {t("nav.departments")}
            </Link>
            <Link href="/admin/doctors" className="opacity-90 hover:opacity-100">
              {t("nav.doctors")}
            </Link>
            <Link href="/admin/conditions" className="opacity-90 hover:opacity-100">
              {t("nav.conditions")}
            </Link>
            <Link href="/admin/news" className="opacity-90 hover:opacity-100">
              {t("nav.news")}
            </Link>
            <Link href="/admin/testimonials" className="opacity-90 hover:opacity-100">
              {t("nav.testimonials")}
            </Link>
            <Link href="/admin/leadership" className="opacity-90 hover:opacity-100">
              {t("nav.leadership")}
            </Link>
            <Link href="/admin/awards" className="opacity-90 hover:opacity-100">
              {t("nav.awards")}
            </Link>
            <Link href="/admin/faq" className="opacity-90 hover:opacity-100">
              {t("nav.faq")}
            </Link>
            <Link href="/admin/careers" className="opacity-90 hover:opacity-100">
              {t("nav.careers")}
            </Link>
            <Link href="/admin/appointments" className="opacity-90 hover:opacity-100">
              {t("nav.appointments")}
            </Link>
            <Link href="/admin/callback-requests" className="opacity-90 hover:opacity-100">
              {t("nav.callbackRequests")}
            </Link>
            <Link href="/admin/payments" className="opacity-90 hover:opacity-100">
              {t("nav.payments")}
            </Link>
            <Link href="/admin/messages" className="opacity-90 hover:opacity-100">
              {t("nav.messages")}
            </Link>
            {(session.user.role === "MARKETING_ADMIN" || session.user.role === "SUPER_ADMIN") && (
              <Link href="/admin/settings" className="opacity-90 hover:opacity-100">
                {t("nav.settings")}
              </Link>
            )}
            {session.user.role === "SUPER_ADMIN" && (
              <>
                <Link href="/admin/users" className="opacity-90 hover:opacity-100">
                  {t("nav.users")}
                </Link>
                <Link href="/admin/audit-log" className="opacity-90 hover:opacity-100">
                  {t("nav.auditLog")}
                </Link>
              </>
            )}
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
              {session.user.name} · {session.user.role}
            </span>
            <LanguageSwitch />
            <LogoutButton />
          </nav>
        )}
      </header>
      <main className="flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
