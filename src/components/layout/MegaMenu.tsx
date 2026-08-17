"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { QuickLinksPanel } from "./QuickLinksPanel";
import { pick } from "@/lib/i18n-content";

type NavKey =
  | "services"
  | "centersOfExcellence"
  | "doctors"
  | "about"
  | "news"
  | "patientInfo";

type DepartmentLink = { slug: string; nameEn: string; nameAr: string };

const STATIC_NAV_LINKS: Record<Exclude<NavKey, "services">, { href: string; labelKey: string }[]> = {
  centersOfExcellence: [
    { href: "/centers-of-excellence", labelKey: "centersOfExcellence" },
  ],
  doctors: [
    { href: "/doctors", labelKey: "doctors" },
    { href: "/doctors/find", labelKey: "doctors" },
  ],
  about: [
    { href: "/about", labelKey: "about" },
    { href: "/about#leadership", labelKey: "leadership" },
    { href: "/about#awards", labelKey: "awards" },
  ],
  news: [
    { href: "/news", labelKey: "news" },
    { href: "/testimonials", labelKey: "testimonials" },
  ],
  patientInfo: [
    { href: "/faq", labelKey: "faq" },
    { href: "/contact", labelKey: "contact" },
    { href: "/careers", labelKey: "careers" },
    { href: "/calculators", labelKey: "calculators" },
    { href: "/callback", labelKey: "callback" },
    { href: "/pay", labelKey: "pay" },
  ],
};

const NAV_ORDER: NavKey[] = [
  "services",
  "centersOfExcellence",
  "doctors",
  "about",
  "news",
  "patientInfo",
];

export function MegaMenu({
  departments,
  emergencyNumber,
}: {
  departments: DepartmentLink[];
  emergencyNumber: string;
}) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [openKey, setOpenKey] = useState<NavKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = (key: NavKey) => {
    setOpenKey((current) => (current === key ? null : key));
  };

  const servicesLinks = [
    ...departments.map((dept) => ({
      href: `/departments/${dept.slug}`,
      label: pick(dept.nameEn, dept.nameAr, locale),
    })),
    { href: "/departments", label: t("services") },
  ];

  const renderLinks = (key: NavKey, onNavigate: () => void) => {
    if (key === "services") {
      return servicesLinks.map((link, index) => (
        <li key={`${link.href}-${index}`}>
          <Link
            href={link.href as never}
            className="text-sm text-ink/80 hover:text-teal"
            onClick={onNavigate}
          >
            {link.label}
          </Link>
        </li>
      ));
    }
    return STATIC_NAV_LINKS[key].map((link, index) => (
      <li key={`${link.href}-${index}`}>
        <Link
          href={link.href as never}
          className="text-sm text-ink/80 hover:text-teal"
          onClick={onNavigate}
        >
          {t(link.labelKey)}
        </Link>
      </li>
    ));
  };

  return (
    <div className="relative">
      <nav className="hidden items-center gap-1 md:flex">
        {NAV_ORDER.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => toggle(key)}
            aria-expanded={openKey === key}
            className={`rounded-full px-3 py-2 text-sm text-ink/80 hover:bg-mint hover:text-ink ${
              openKey === key ? "bg-mint text-ink" : ""
            }`}
          >
            {t(key)}
          </button>
        ))}
      </nav>

      <button
        type="button"
        className="grid h-9 w-9 place-items-center rounded-full text-xl text-ink md:hidden"
        aria-label="Toggle navigation"
        onClick={() => setMobileOpen((open) => !open)}
      >
        ☰
      </button>

      {openKey && (
        <div className="absolute end-0 top-full z-20 mt-3 hidden w-[min(640px,90vw)] overflow-hidden rounded-2xl border border-line bg-white shadow-xl md:flex">
          <div className="flex-1 p-5">
            <p className="mb-3 font-display text-xs font-bold uppercase tracking-wide text-teal">
              {t(openKey)}
            </p>
            <ul className="flex flex-col gap-2">
              {renderLinks(openKey, () => setOpenKey(null))}
            </ul>
          </div>
          <QuickLinksPanel emergencyNumber={emergencyNumber} />
        </div>
      )}

      {mobileOpen && (
        <div className="absolute end-0 top-full z-20 mt-3 flex w-[92vw] max-w-sm flex-col gap-4 rounded-2xl border border-line bg-white p-5 shadow-xl md:hidden">
          {NAV_ORDER.map((key) => (
            <div key={key}>
              <p className="mb-1 font-display text-xs font-bold uppercase tracking-wide text-teal">
                {t(key)}
              </p>
              <ul className="flex flex-col gap-1 ps-1">
                {renderLinks(key, () => setMobileOpen(false))}
              </ul>
            </div>
          ))}
          <QuickLinksPanel emergencyNumber={emergencyNumber} />
        </div>
      )}
    </div>
  );
}
