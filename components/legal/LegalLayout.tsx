export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-accent-cyan">Legal</div>
      <h1 className="font-display text-3xl font-black sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-fg-muted">Last updated {updated}</p>

      <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-fg-muted [&_h2]:mt-4 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-fg [&_strong]:text-fg">
        {children}
      </div>
    </div>
  );
}
