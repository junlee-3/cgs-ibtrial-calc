export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/80 bg-primary text-primary-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-lg font-semibold tracking-tight">Canberra Grammar School</p>
          <p className="mt-1 max-w-md text-sm text-white/75">
            Ready for the world — IB World School. Estimates use CGS 2026 three-year-average grade boundaries.
          </p>
        </div>
        <div className="flex flex-col gap-1 text-sm text-white/70 sm:items-end">
          <a href="https://cgs.act.edu.au/" className="underline-offset-4 transition-colors hover:text-white hover:underline" target="_blank" rel="noreferrer">
            cgs.act.edu.au
          </a>
          <a href="https://ibo.org/" className="underline-offset-4 transition-colors hover:text-white hover:underline" target="_blank" rel="noreferrer">
            ibo.org
          </a>
        </div>
      </div>
    </footer>
  );
}
