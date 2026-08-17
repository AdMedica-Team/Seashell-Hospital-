"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

const ROLE_GOALS = {
  patient: ["findDoctor", "conditionsTreatments", "checkSymptoms", "bookAppointment", "viewServices"],
  visitor: ["contactUs", "centersOfExcellence", "news", "about"],
  caregiver: ["findDoctor", "bookAppointment", "contactUs", "faq"],
  jobSeeker: ["careers"],
  doctor: ["careers", "contactUs"],
  student: ["careers", "contactUs"],
  patron: ["contactUs", "about"],
} as const;

type Role = keyof typeof ROLE_GOALS;
type Goal = (typeof ROLE_GOALS)[Role][number];

const GOAL_ROUTES: Record<Goal, string> = {
  findDoctor: "/doctors/find",
  conditionsTreatments: "/departments",
  checkSymptoms: "/calculators",
  bookAppointment: "/appointment",
  viewServices: "/departments",
  faq: "/faq",
  contactUs: "/contact",
  centersOfExcellence: "/centers-of-excellence",
  news: "/news",
  about: "/about",
  careers: "/careers",
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FieldDropdown<T extends string>({
  label,
  value,
  options,
  optionLabel,
  open,
  onOpenChange,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  optionLabel: (option: T) => string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (option: T) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) onOpenChange(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, onOpenChange]);

  return (
    <div ref={containerRef} className="flex items-start gap-3 text-lg text-white">
      <span className="pt-1">{label}</span>
      <div className="flex flex-col items-start">
        <button
          type="button"
          onClick={() => onOpenChange(!open)}
          aria-expanded={open}
          className="flex items-center gap-2 border-b-2 border-white/40 pb-1 font-display text-xl font-bold italic text-white"
        >
          {optionLabel(value)}
          <ChevronIcon open={open} />
        </button>

        {open && (
          <div className="flex flex-col items-start gap-4 pt-4">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  onOpenChange(false);
                }}
                className={`font-display text-lg italic ${
                  option === value ? "font-bold text-white" : "text-white/70 hover:text-white"
                }`}
              >
                {optionLabel(option)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function LetUsHelp() {
  const t = useTranslations("letUsHelp");
  const router = useRouter();
  const [role, setRole] = useState<Role>("patient");
  const [goal, setGoal] = useState<Goal>(ROLE_GOALS.patient[0]);
  const [openField, setOpenField] = useState<"role" | "goal" | null>(null);

  const changeRole = (next: Role) => {
    setRole(next);
    setGoal(ROLE_GOALS[next][0]);
  };

  return (
    <section className="bg-[linear-gradient(135deg,#28407a_0%,#1f396b_45%,#152a52_100%)] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-4xl text-white sm:text-5xl">{t("heading")}</h2>
        <p className="mt-3 text-lg text-white/80">{t("subtext")}</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push(GOAL_ROUTES[goal]);
          }}
          className="mt-12 flex flex-wrap items-start justify-center gap-x-6 gap-y-8 sm:gap-x-10"
        >
          <FieldDropdown
            label={t("imA")}
            value={role}
            options={Object.keys(ROLE_GOALS) as Role[]}
            optionLabel={(r) => t(`roles.${r}`)}
            open={openField === "role"}
            onOpenChange={(next) => setOpenField(next ? "role" : null)}
            onChange={changeRole}
          />

          <FieldDropdown
            label={t("lookingFor")}
            value={goal}
            options={ROLE_GOALS[role]}
            optionLabel={(g) => t(`goals.${g}`)}
            open={openField === "goal"}
            onOpenChange={(next) => setOpenField(next ? "goal" : null)}
            onChange={setGoal}
          />

          <button
            type="submit"
            aria-label={t("go")}
            className="icon-flip grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-teal transition hover:bg-mint"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
}
