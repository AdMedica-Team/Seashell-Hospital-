export function LegalDocument({
  eyebrow,
  heading,
  updated,
  draftNotice,
  sections,
}: {
  eyebrow: string;
  heading: string;
  updated: string;
  draftNotice?: string;
  sections: { heading: string; body: string }[];
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="font-display text-xs font-bold uppercase tracking-wide text-teal">{eyebrow}</p>
      <h1 className="mt-2 font-display text-4xl text-ink">{heading}</h1>
      <p className="mt-2 text-sm text-muted">{updated}</p>

      {draftNotice && (
        <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {draftNotice}
        </p>
      )}

      <div className="mt-10 flex flex-col gap-8">
        {sections.map((section, index) => (
          <section key={index}>
            <h2 className="font-display text-lg text-ink">{section.heading}</h2>
            <p className="mt-2 whitespace-pre-line text-ink/80">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
