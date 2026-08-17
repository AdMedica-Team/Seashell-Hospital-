"use client";

import { useState } from "react";
import { pick } from "@/lib/i18n-content";
import type { FAQItem } from "@/generated/prisma/client";

export function FaqAccordion({ items, locale }: { items: FAQItem[]; locale: string }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const categories = Array.from(new Set(items.map((item) => item.category)));

  return (
    <div className="flex flex-col gap-8">
      {categories.map((category) => (
        <div key={category}>
          <h2 className="font-display text-lg text-ink">{category}</h2>
          <div className="mt-3 flex flex-col gap-2">
            {items
              .filter((item) => item.category === category)
              .map((item) => {
                const open = openId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setOpenId(open ? null : item.id)}
                    aria-expanded={open}
                    className="grid grid-cols-[1fr_auto] gap-2 rounded-2xl border border-line bg-white px-5 py-4 text-start"
                  >
                    <span className="text-ink">{pick(item.questionEn, item.questionAr, locale)}</span>
                    <b className="font-normal text-teal">{open ? "−" : "+"}</b>
                    {open && (
                      <p className="col-span-2 mt-1 text-sm text-muted">
                        {pick(item.answerEn, item.answerAr, locale)}
                      </p>
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
