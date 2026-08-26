export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-white/60">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="eyebrow">Canberra Grammar School</p>
          <p className="mt-2 max-w-md text-sm text-text-2">
            IB World School. Estimates use CGS 2026 three-year-average grade boundaries — exam papers only.
          </p>
        </div>
        <div className="flex flex-col gap-1 text-sm sm:items-end">
          <a
            href="https://cgs.act.edu.au/"
            className="font-medium text-coral-text underline-offset-4 transition-colors hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            cgs.act.edu.au
          </a>
          <a
            href="https://ibo.org/"
            className="text-text-3 underline-offset-4 transition-colors hover:text-foreground hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            ibo.org
          </a>
        </div>
      </div>
    </footer>
  );
}
