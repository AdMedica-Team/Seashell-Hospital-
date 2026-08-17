import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { MegaMenu } from "./MegaMenu";
import { LanguageSwitch } from "./LanguageSwitch";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/settings";

export async function SiteHeader() {
  const [departments, settings] = await Promise.all([
    prisma.department.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
      select: { slug: true, nameEn: true, nameAr: true },
    }),
    getSiteSettings(),
  ]);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-line bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
      <Link href="/" className="flex items-center text-ink">
        <Image
          src="/seashell-logo.svg"
          alt="Seashell Hospital"
          width={265}
          height={61}
          priority
          className="h-10 w-auto"
        />
      </Link>

      <div className="flex items-center gap-3">
        <MegaMenu departments={departments} emergencyNumber={settings.emergencyNumber} />
        <LanguageSwitch />
      </div>
    </header>
  );
}
