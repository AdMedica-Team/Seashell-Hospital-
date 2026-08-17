import { useTranslations } from "next-intl";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function AdminLoginPage({
  params,
}: PageProps<"/[locale]/admin/login">) {
  const { locale } = await params;

  return <LoginContent locale={locale} />;
}

function LoginContent({ locale }: { locale: string }) {
  const t = useTranslations("admin.login");

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 pt-16">
      <div>
        <p className="font-display text-xs font-bold uppercase tracking-wide text-teal">
          {t("eyebrow")}
        </p>
        <h1 className="font-display text-2xl text-ink">{t("title")}</h1>
      </div>
      <LoginForm locale={locale} />
    </div>
  );
}
