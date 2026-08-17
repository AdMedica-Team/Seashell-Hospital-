"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function BmrCalculator() {
  const t = useTranslations("pages.calculators");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"male" | "female">("female");

  const w = parseFloat(weight);
  const h = parseFloat(height);
  const a = parseFloat(age);
  const valid = w > 0 && h > 0 && a > 0;
  const bmr = valid ? 10 * w + 6.25 * h - 5 * a + (sex === "male" ? 5 : -161) : null;

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("sex")}
        <select
          value={sex}
          onChange={(e) => setSex(e.target.value as "male" | "female")}
          className="rounded-lg border border-line px-3 py-2"
        >
          <option value="female">{t("female")}</option>
          <option value="male">{t("male")}</option>
        </select>
      </label>
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
      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("age")}
        <input
          type="number"
          inputMode="numeric"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="rounded-lg border border-line px-3 py-2"
        />
      </label>

      {bmr !== null && Number.isFinite(bmr) && (
        <div className="rounded-xl border border-line bg-mint p-4">
          <p className="text-xs uppercase tracking-wide text-teal">{t("yourResult")}</p>
          <p className="mt-1 font-display text-3xl text-ink">{Math.round(bmr)}</p>
          <p className="text-sm text-ink/80">{t("caloriesPerDay")}</p>
        </div>
      )}

      <p className="text-xs text-muted">{t("disclaimer")}</p>
    </div>
  );
}
