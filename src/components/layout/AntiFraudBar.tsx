"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * Dismissible anti-fraud notice bar pinned to the very top (SGH-style). Dark
 * band with the scam warning + a link to the full anti-fraud notice.
 */
export function AntiFraudBar() {
  const t = useTranslations("topbar");
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div className="bg-[#1f396b] text-white">
      <div className="mx-auto flex max-w-6xl items-start gap-4 px-4 py-2.5 text-sm sm:px-6">
        <p className="flex-1 leading-snug">
          {t("antiFraud")}{" "}
          <Link href="/anti-fraud-notice" className="whitespace-nowrap underline hover:no-underline">
            {t("antiFraudMore")}
          </Link>
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={t("close")}
          className="shrink-0 text-xl leading-none text-white/80 transition hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
