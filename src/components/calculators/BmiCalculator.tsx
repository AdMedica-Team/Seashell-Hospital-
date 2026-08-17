"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

function bmiCategory(bmi: number, t: (key: string) => string) {
  if (bmi < 18.5) return t("bmiCategoryUnderweight");
  if (bmi < 25) return t("bmiCategoryNormal");
  if (bmi < 30) return t("bmiCategoryOverweight");
  return t("bmiCategoryObese");
}

export function BmiCalculator() {
  const t = useTranslations("pages.calculators");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const w = parseFloat(weight);
  const h = parseFloat(height) / 100;
  const bmi = w > 0 && h > 0 ? w / (h * h) : null;

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("weightKg")}
        <input
          type="number"
          inputMode="decimal"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="rounded-lg border border-line px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("heightCm")}
        <input
          type="number"
          inputMode="decimal"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="rounded-lg border border-line px-3 py-2"
        />
      </label>

      {bmi !== null && Number.isFinite(bmi) && (
        <div className="rounded-xl border border-line bg-mint p-4">
          <p className="text-xs uppercase tracking-wide text-teal">{t("yourResult")}</p>
          <p className="mt-1 font-display text-3xl text-ink">{bmi.toFixed(1)}</p>
          <p className="text-sm text-ink/80">{bmiCategory(bmi, t)}</p>
        </div>
      )}

      <p className="text-xs text-muted">{t("disclaimer")}</p>
    </div>
  );
}
