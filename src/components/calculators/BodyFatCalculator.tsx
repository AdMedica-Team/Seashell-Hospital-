"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

function usNavyBodyFat(params: {
  sex: "male" | "female";
  heightCm: number;
  waistCm: number;
  neckCm: number;
  hipCm: number;
}) {
  const { sex, heightCm, waistCm, neckCm, hipCm } = params;
  if (sex === "male") {
    return (
      495 /
        (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) -
      450
    );
  }
  return (
    495 /
      (1.29579 -
        0.35004 * Math.log10(waistCm + hipCm - neckCm) +
        0.221 * Math.log10(heightCm)) -
    450
  );
}

export function BodyFatCalculator() {
  const t = useTranslations("pages.calculators");
  const [sex, setSex] = useState<"male" | "female">("female");
  const [height, setHeight] = useState("");
  const [waist, setWaist] = useState("");
  const [neck, setNeck] = useState("");
  const [hip, setHip] = useState("");

  const h = parseFloat(height);
  const wa = parseFloat(waist);
  const n = parseFloat(neck);
  const hi = parseFloat(hip);

  const valid = sex === "male" ? h > 0 && wa > n && n > 0 : h > 0 && wa + hi > n && n > 0 && hi > 0;
  const bodyFat = valid ? usNavyBodyFat({ sex, heightCm: h, waistCm: wa, neckCm: n, hipCm: hi }) : null;

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
        {t("heightCm")}
        <input type="number" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} className="rounded-lg border border-line px-3 py-2" />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("waistCm")}
        <input type="number" inputMode="decimal" value={waist} onChange={(e) => setWaist(e.target.value)} className="rounded-lg border border-line px-3 py-2" />
      </label>
      <label className="flex flex-col gap-1 text-sm text-ink">
        {t("neckCm")}
        <input type="number" inputMode="decimal" value={neck} onChange={(e) => setNeck(e.target.value)} className="rounded-lg border border-line px-3 py-2" />
      </label>
      {sex === "female" && (
        <label className="flex flex-col gap-1 text-sm text-ink">
          {t("hipCm")}
          <input type="number" inputMode="decimal" value={hip} onChange={(e) => setHip(e.target.value)} className="rounded-lg border border-line px-3 py-2" />
        </label>
      )}

      {bodyFat !== null && Number.isFinite(bodyFat) && bodyFat > 0 && (
        <div className="rounded-xl border border-line bg-mint p-4">
          <p className="text-xs uppercase tracking-wide text-teal">{t("yourResult")}</p>
          <p className="mt-1 font-display text-3xl text-ink">{bodyFat.toFixed(1)}%</p>
        </div>
      )}

      <p className="text-xs text-muted">{t("disclaimer")}</p>
    </div>
  );
}
