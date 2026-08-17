import { useTranslations } from "next-intl";
import { logoutAction } from "@/lib/actions/auth";

export function LogoutButton() {
  const t = useTranslations("admin.nav");

  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="rounded-full border border-white/30 px-3 py-1 text-xs"
      >
        {t("logout")}
      </button>
    </form>
  );
}
