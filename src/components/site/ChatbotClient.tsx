"use client";

import { useRef, useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { pick } from "@/lib/i18n-content";
import { chatbotSearch } from "@/lib/actions/chatbot";
import { usePastHero } from "@/lib/use-past-hero";

type DeptLink = { slug: string; nameEn: string; nameAr: string };
type FaqEntry = { questionEn: string; questionAr: string; answerEn: string; answerAr: string };

type LinkItem = { href: string; label: string; sub?: string };
type FaqItem = { q: string; a: string };

type Entry =
  | { kind: "bot"; text: string }
  | { kind: "user"; text: string }
  | { kind: "links"; heading?: string; items: LinkItem[] }
  | { kind: "faq"; heading?: string; items: FaqItem[] }
  | { kind: "cta"; href: string; label: string }
  | { kind: "contact"; items: { label: string; value: string; href: string }[] }
  | { kind: "bullets"; heading?: string; note?: string; items: string[] }
  | { kind: "external"; heading?: string; text?: string; href: string; label: string };

let entryId = 0;
const withId = (entry: Entry) => ({ ...entry, _id: entryId++ });

export function ChatbotClient({
  departments,
  faqs,
  emergencyNumber,
  hotlineNumber,
  whatsappNumber,
  addressEn,
  addressAr,
  locationLink,
  careersEmail,
  insurancePartners,
}: {
  departments: DeptLink[];
  faqs: FaqEntry[];
  emergencyNumber: string;
  hotlineNumber: string;
  whatsappNumber: string | null;
  addressEn: string;
  addressAr: string;
  locationLink: string;
  careersEmail: string;
  insurancePartners: { en: string; ar: string }[];
}) {
  const t = useTranslations("chatbot");
  const locale = useLocale();
  const pathname = usePathname();
  const pastHero = usePastHero();
  const hideForHero = pathname === "/" && !pastHero;
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<(Entry & { _id: number })[]>([
    withId({ kind: "bot", text: t("greeting") }),
  ]);
  const [input, setInput] = useState("");
  const [pending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);

  const push = (...items: Entry[]) => {
    setEntries((prev) => [...prev, ...items.map(withId)]);
    // Scroll to the newest entry after the DOM updates.
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  };

  const handleMenu = (
    key: "book" | "findDoctor" | "departments" | "faq" | "contact" | "careers" | "insurance",
  ) => {
    if (key === "book") {
      push(
        { kind: "user", text: t("menuBook") },
        { kind: "bot", text: t("bookGuidance") },
        { kind: "cta", href: "/appointment", label: t("bookCta") },
      );
    } else if (key === "findDoctor") {
      push({ kind: "user", text: t("menuFindDoctor") }, { kind: "bot", text: t("findDoctorPrompt") });
    } else if (key === "departments") {
      push(
        { kind: "user", text: t("menuDepartments") },
        {
          kind: "links",
          heading: t("departmentsIntro"),
          items: departments.map((d) => ({
            href: `/departments/${d.slug}`,
            label: pick(d.nameEn, d.nameAr, locale),
          })),
        },
      );
    } else if (key === "faq") {
      push(
        { kind: "user", text: t("menuFaq") },
        {
          kind: "faq",
          heading: t("faqIntro"),
          items: faqs.map((f) => ({
            q: pick(f.questionEn, f.questionAr, locale),
            a: pick(f.answerEn, f.answerAr, locale),
          })),
        },
      );
    } else if (key === "contact") {
      const items: { label: string; value: string; href: string }[] = [
        { label: t("emergency"), value: emergencyNumber, href: `tel:${emergencyNumber}` },
        { label: t("hotline"), value: hotlineNumber, href: `tel:${hotlineNumber.replace(/\s+/g, "")}` },
      ];
      if (whatsappNumber) {
        items.push({
          label: t("whatsapp"),
          value: whatsappNumber,
          href: `https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}`,
        });
      }
      push(
        { kind: "user", text: t("menuContact") },
        { kind: "contact", items },
        {
          kind: "external",
          heading: t("addressLabel"),
          text: pick(addressEn, addressAr, locale),
          href: locationLink,
          label: t("openMap"),
        },
      );
    } else if (key === "careers") {
      push(
        { kind: "user", text: t("menuCareers") },
        {
          kind: "external",
          text: t("careersIntro"),
          href: `mailto:${careersEmail}`,
          label: careersEmail,
        },
      );
    } else if (key === "insurance") {
      push(
        { kind: "user", text: t("menuInsurance") },
        {
          kind: "bullets",
          heading: t("insuranceIntro"),
          note: t("insuranceNote"),
          items: insurancePartners.map((p) => pick(p.en, p.ar, locale)),
        },
      );
    }
  };

  const runSearch = (raw: string) => {
    const query = raw.trim();
    if (!query) return;
    push({ kind: "user", text: query });
    setInput("");
    startTransition(async () => {
      const res = await chatbotSearch(query);
      const items: LinkItem[] = [
        ...res.doctors.map((d) => ({
          href: `/doctors/${d.slug}`,
          label: pick(d.nameEn, d.nameAr, locale),
          sub: pick(d.titleEn, d.titleAr, locale),
        })),
        ...res.departments.map((d) => ({
          href: `/departments/${d.slug}`,
          label: pick(d.nameEn, d.nameAr, locale),
          sub: t("resultsDepartments"),
        })),
      ];
      const faqItems: FaqItem[] = res.faqs.map((f) => ({
        q: pick(f.questionEn, f.questionAr, locale),
        a: pick(f.answerEn, f.answerAr, locale),
      }));

      if (items.length === 0 && faqItems.length === 0) {
        push(
          { kind: "bot", text: t("noResults") },
          {
            kind: "links",
            items: [{ href: `/search?q=${encodeURIComponent(query)}`, label: t("searchAll") }],
          },
        );
        return;
      }
      if (items.length > 0) push({ kind: "links", items });
      if (faqItems.length > 0) push({ kind: "faq", heading: t("resultsFaq"), items: faqItems });
    });
  };

  const menuButtons = (
    <div className="flex flex-wrap gap-2">
      <MenuChip onClick={() => handleMenu("book")}>{t("menuBook")}</MenuChip>
      <MenuChip onClick={() => handleMenu("findDoctor")}>{t("menuFindDoctor")}</MenuChip>
      <MenuChip onClick={() => handleMenu("departments")}>{t("menuDepartments")}</MenuChip>
      <MenuChip onClick={() => handleMenu("insurance")}>{t("menuInsurance")}</MenuChip>
      <MenuChip onClick={() => handleMenu("careers")}>{t("menuCareers")}</MenuChip>
      <MenuChip onClick={() => handleMenu("faq")}>{t("menuFaq")}</MenuChip>
      <MenuChip onClick={() => handleMenu("contact")}>{t("menuContact")}</MenuChip>
    </div>
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("launcher")}
        className={`fixed bottom-20 end-4 z-50 flex items-center gap-2 rounded-full bg-[linear-gradient(160deg,#1fb0e0_0%,#0090d7_55%,#0a6fae_100%)] px-4 py-3 text-sm font-medium text-white shadow-[0_10px_25px_rgba(0,144,215,0.4),inset_0_1px_0_rgba(255,255,255,0.4)] transition-all duration-500 ease-out hover:-translate-y-0.5 hover:brightness-110 sm:bottom-24 sm:end-6 ${
          hideForHero ? "translate-y-4 opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
        }`}
      >
        <span aria-hidden className="text-lg leading-none">💬</span>
        <span className="hidden sm:inline">{t("launcher")}</span>
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label={t("title")}
      className="fixed bottom-20 end-4 z-50 flex h-[min(34rem,calc(100vh-9rem))] w-[min(23rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-2xl sm:bottom-24 sm:end-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-[#1f396b] px-4 py-3 text-white">
        <div>
          <p className="font-display text-sm">{t("title")}</p>
          <p className="text-xs opacity-70">{t("subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={t("close")}
          className="grid h-8 w-8 place-items-center rounded-full text-lg hover:bg-white/10"
        >
          ✕
        </button>
      </div>

      {/* Conversation */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-[#f5f6f7] p-4">
        {entries.map((entry) => (
          <EntryView key={entry._id} entry={entry} onClose={() => setOpen(false)} contactPageLabel={t("contactPage")} />
        ))}
        {pending && <p className="text-xs text-muted">…</p>}
        <div className="pt-1">{menuButtons}</div>
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(input);
        }}
        className="flex items-center gap-2 border-t border-line bg-white p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("inputPlaceholder")}
          className="min-w-0 flex-1 rounded-full border border-line px-4 py-2 text-sm outline-none focus:border-teal"
        />
        <button
          type="submit"
          disabled={pending || input.trim().length === 0}
          className="shrink-0 rounded-full bg-teal px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {t("send")}
        </button>
      </form>
    </div>
  );
}

function MenuChip({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-teal/40 bg-white px-3 py-1.5 text-xs font-medium text-teal transition hover:bg-mint"
    >
      {children}
    </button>
  );
}

function EntryView({
  entry,
  onClose,
  contactPageLabel,
}: {
  entry: Entry;
  onClose: () => void;
  contactPageLabel: string;
}) {
  if (entry.kind === "bot") {
    return (
      <div className="max-w-[85%] rounded-2xl rounded-ss-sm bg-white px-3 py-2 text-sm text-ink shadow-sm">
        {entry.text}
      </div>
    );
  }
  if (entry.kind === "user") {
    return (
      <div className="ms-auto max-w-[85%] rounded-2xl rounded-se-sm bg-teal px-3 py-2 text-sm text-white">
        {entry.text}
      </div>
    );
  }
  if (entry.kind === "cta") {
    return (
      <Link
        href={entry.href as never}
        onClick={onClose}
        className="inline-block rounded-full bg-teal px-5 py-2 text-sm font-medium text-white"
      >
        {entry.label}
      </Link>
    );
  }
  if (entry.kind === "links") {
    return (
      <div className="max-w-[92%] space-y-2">
        {entry.heading && <p className="text-sm text-ink">{entry.heading}</p>}
        <div className="flex flex-col gap-1.5">
          {entry.items.map((item, i) => (
            <Link
              key={i}
              href={item.href as never}
              onClick={onClose}
              className="rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink transition hover:border-teal"
            >
              <span className="font-medium">{item.label}</span>
              {item.sub && <span className="block text-xs text-muted">{item.sub}</span>}
            </Link>
          ))}
        </div>
      </div>
    );
  }
  if (entry.kind === "faq") {
    return (
      <div className="max-w-[92%] space-y-2">
        {entry.heading && <p className="text-sm text-ink">{entry.heading}</p>}
        <div className="flex flex-col gap-1.5">
          {entry.items.map((item, i) => (
            <details key={i} className="rounded-xl border border-line bg-white px-3 py-2 text-sm">
              <summary className="cursor-pointer font-medium text-ink">{item.q}</summary>
              <p className="mt-2 text-ink/75">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    );
  }
  if (entry.kind === "bullets") {
    return (
      <div className="max-w-[92%] space-y-2">
        {entry.heading && <p className="text-sm text-ink">{entry.heading}</p>}
        <ul className="flex flex-col gap-1 rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink">
          {entry.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        {entry.note && <p className="text-xs text-muted">{entry.note}</p>}
      </div>
    );
  }
  if (entry.kind === "external") {
    return (
      <div className="max-w-[92%] space-y-2">
        {entry.heading && <p className="text-sm font-medium text-ink">{entry.heading}</p>}
        {entry.text && <p className="text-sm text-ink/80">{entry.text}</p>}
        <a
          href={entry.href}
          target={entry.href.startsWith("http") ? "_blank" : undefined}
          rel={entry.href.startsWith("http") ? "noreferrer" : undefined}
          className="inline-block rounded-full bg-teal px-5 py-2 text-sm font-medium text-white"
        >
          {entry.label}
        </a>
      </div>
    );
  }
  // contact
  return (
    <div className="max-w-[92%] space-y-2">
      <div className="flex flex-col gap-1.5">
        {entry.items.map((item, i) => (
          <a
            key={i}
            href={item.href}
            className="flex items-center justify-between rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink transition hover:border-teal"
          >
            <span className="text-muted">{item.label}</span>
            <span dir="ltr" className="font-medium">{item.value}</span>
          </a>
        ))}
      </div>
      <Link
        href="/contact"
        onClick={onClose}
        className="inline-block text-sm font-medium text-teal"
      >
        {contactPageLabel}
      </Link>
    </div>
  );
}
