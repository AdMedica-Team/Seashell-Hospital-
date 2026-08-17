"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/i18n-content";
import type { Department, DepartmentProcedure } from "@/generated/prisma/client";

type CoeDepartment = Department & { procedures: DepartmentProcedure[] };

export function CentersOfExcellenceShowcase({
  departments,
  locale,
}: {
  departments: CoeDepartment[];
  locale: string;
}) {
  const t = useTranslations("pages.centersOfExcellence");
  const [selectedId, setSelectedId] = useState(departments[0]?.id);
  const selected = departments.find((d) => d.id === selectedId);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {departments.map((dept) => (
          <button
            key={dept.id}
            type="button"
            onClick={() => setSelectedId(dept.id)}
            className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
              selectedId === dept.id
                ? "border-teal bg-teal text-white"
                : "border-line bg-white text-ink/80 hover:border-teal"
            }`}
          >
            {pick(dept.nameEn, dept.nameAr, locale)}
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-8 grid grid-cols-1 gap-8 rounded-3xl border border-line bg-white p-6 sm:p-8 lg:grid-cols-2">
          <div
            className="min-h-48 rounded-2xl bg-mint bg-cover bg-center"
            style={
              selected.coeImageUrl ? { backgroundImage: `url(${selected.coeImageUrl})` } : undefined
            }
          />
          <div>
            <h3 className="font-display text-2xl text-ink">{pick(selected.nameEn, selected.nameAr, locale)}</h3>
            <p className="mt-2 text-ink/80">
              {pick(selected.coeBlurbEn ?? selected.summaryEn, selected.coeBlurbAr ?? selected.summaryAr, locale)}
            </p>

            {selected.procedures.length > 0 && (
              <div className="mt-4">
                <p className="font-display text-sm text-ink">{t("procedures")}</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {selected.procedures.map((proc) => (
                    <li
                      key={proc.id}
                      className="rounded-full bg-mint px-3 py-1 text-xs text-ink/80"
                    >
                      {pick(proc.nameEn, proc.nameAr, locale)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link
              href={`/appointment?department=${selected.slug}`}
              className="mt-6 inline-block rounded-full bg-teal px-6 py-3 text-sm font-medium text-white"
            >
              {t("bookCta")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
