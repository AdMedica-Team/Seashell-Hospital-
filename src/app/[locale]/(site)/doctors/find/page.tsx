import { useTranslations } from "next-intl";
import { prisma } from "@/lib/db";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/i18n-content";
import type { Department, Condition, Doctor } from "@/generated/prisma/client";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default async function FindDoctorPage({
  params,
  searchParams,
}: PageProps<"/[locale]/doctors/find">) {
  const { locale } = await params;
  const { mode: rawMode, id, letter: rawLetter } = await searchParams;
  const mode = rawMode === "condition" || rawMode === "specialty" ? rawMode : "name";
  const selectedId = typeof id === "string" ? id : undefined;
  const letter = typeof rawLetter === "string" ? rawLetter.toUpperCase() : undefined;

  const [departments, conditions] = await Promise.all([
    prisma.department.findMany({ where: { isPublished: true }, orderBy: { order: "asc" } }),
    prisma.condition.findMany({ orderBy: { nameEn: "asc" } }),
  ]);

  let doctors: Doctor[] = [];
  if (selectedId && mode === "specialty") {
    doctors = await prisma.doctor.findMany({
      where: { isPublished: true, departments: { some: { departmentId: selectedId } } },
    });
  } else if (selectedId && mode === "condition") {
    const condition = await prisma.condition.findUnique({
      where: { id: selectedId },
      include: {
        doctors: { include: { doctor: true } },
        departments: {
          include: { department: { include: { doctors: { include: { doctor: true } } } } },
        },
      },
    });
    if (condition) {
      const direct = condition.doctors.map((d) => d.doctor);
      const viaDepartment = condition.departments.flatMap((cd) =>
        cd.department.doctors.map((dd) => dd.doctor),
      );
      const merged = new Map([...direct, ...viaDepartment].map((d) => [d.id, d]));
      doctors = Array.from(merged.values()).filter((d) => d.isPublished);
    }
  } else if (letter && mode === "name") {
    doctors = await prisma.doctor.findMany({
      where: {
        isPublished: true,
        OR: [
          { nameEn: { startsWith: letter, mode: "insensitive" } },
          { nameEn: { startsWith: `Dr. ${letter}`, mode: "insensitive" } },
        ],
      },
      orderBy: { nameEn: "asc" },
    });
  }

  return (
    <FindDoctorContent
      locale={locale}
      mode={mode}
      selectedId={selectedId}
      letter={letter}
      departments={departments}
      conditions={conditions}
      doctors={doctors}
    />
  );
}

function DoctorIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" strokeLinecap="round" />
    </svg>
  );
}

function ConditionIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path
        d="M3 12h4l2-5 3 10 2-7 2 4h5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpecialtyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M12 8v8M8 12h8" strokeLinecap="round" />
    </svg>
  );
}

function FindDoctorContent({
  locale,
  mode,
  selectedId,
  letter,
  departments,
  conditions,
  doctors,
}: {
  locale: string;
  mode: "specialty" | "condition" | "name";
  selectedId?: string;
  letter?: string;
  departments: Department[];
  conditions: Condition[];
  doctors: Doctor[];
}) {
  const t = useTranslations("pages.findDoctor");
  const hasResults = mode === "name" ? Boolean(letter) : Boolean(selectedId);

  const modes = [
    { key: "name" as const, label: t("byName"), icon: <DoctorIcon /> },
    { key: "specialty" as const, label: t("bySpecialty"), icon: <SpecialtyIcon /> },
    { key: "condition" as const, label: t("byCondition"), icon: <ConditionIcon /> },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="font-display text-xs font-bold uppercase tracking-wide text-teal">{t("eyebrow")}</p>
      <h1 className="mt-2 font-display text-3xl text-ink">{t("heading")}</h1>

      <p className="mt-10 text-center font-display text-xl text-ink">{t("chooseMode")}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {modes.map((m) => (
          <Link
            key={m.key}
            href={{ pathname: "/doctors/find", query: { mode: m.key } }}
            className={`flex min-w-[180px] flex-1 items-center justify-center gap-3 rounded-2xl border px-6 py-5 text-base font-bold shadow-sm transition sm:flex-none ${
              mode === m.key
                ? "border-teal bg-teal text-white"
                : "border-line bg-white text-ink hover:border-teal"
            }`}
          >
            <span className={mode === m.key ? "text-white" : "text-teal"}>{m.icon}</span>
            {m.label}
          </Link>
        ))}
      </div>

      {mode === "name" ? (
        <div className="mt-6 rounded-2xl border border-line bg-white p-8 shadow-sm">
          <p className="text-center font-display text-lg font-bold text-ink">{t("chooseLetter")}</p>
          <div className="mx-auto mt-6 grid max-w-md grid-cols-6 justify-items-center gap-4">
            {LETTERS.map((l) => (
              <Link
                key={l}
                href={{ pathname: "/doctors/find", query: { mode: "name", letter: l } }}
                className={`grid h-10 w-10 place-items-center rounded-full border text-sm font-semibold ${
                  letter === l
                    ? "border-teal bg-teal text-white"
                    : "border-line bg-white text-ink hover:border-teal"
                }`}
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <p className="mb-2 text-sm text-muted">
            {mode === "specialty" ? t("chooseSpecialty") : t("chooseCondition")}
          </p>
          <div className="flex flex-wrap gap-2">
            {(mode === "specialty" ? departments : conditions).map((item) => (
              <Link
                key={item.id}
                href={{ pathname: "/doctors/find", query: { mode, id: item.id } }}
                className={`rounded-full border px-4 py-2 text-sm ${
                  selectedId === item.id
                    ? "border-teal bg-mint text-ink"
                    : "border-line bg-white text-ink/80 hover:border-teal"
                }`}
              >
                {pick(item.nameEn, item.nameAr, locale)}
              </Link>
            ))}
          </div>
        </div>
      )}

      {hasResults && (
        <div className="mt-10">
          <h2 className="font-display text-lg text-ink">{t("results")}</h2>
          {doctors.length === 0 ? (
            <p className="mt-3 text-sm text-muted">{t("noResults")}</p>
          ) : (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {doctors.map((doctor) => (
                <Link
                  key={doctor.id}
                  href={`/doctors/${doctor.slug}`}
                  className="rounded-xl border border-line bg-white p-4 hover:border-teal"
                >
                  <p className="font-display text-ink">{pick(doctor.nameEn, doctor.nameAr, locale)}</p>
                  <p className="text-sm text-muted">{pick(doctor.titleEn, doctor.titleAr, locale)}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
