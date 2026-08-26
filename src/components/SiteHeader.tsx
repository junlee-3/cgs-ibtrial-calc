import Link from 'next/link';
import { CgsMark } from '@/components/brand/CgsMark';

export function SiteHeader() {
  return (
    <header className="border-b border-border/80 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-lg focus-visible:outline-none"
        >
          <CgsMark className="size-9 shrink-0 transition-transform duration-200 ease-[var(--ease-brand)] group-hover:scale-[1.03]" />
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight text-foreground sm:text-base">CGS IB Calculator</p>
            <p className="eyebrow mt-0.5 normal-case tracking-[0.08em]">Trial grades · 2026</p>
          </div>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/" className="rounded-lg px-3 py-1.5 text-text-2 transition-colors duration-200 hover:bg-surface-2 hover:text-foreground">
            Calculator
          </Link>
          <Link href="/boundaries" className="rounded-lg px-3 py-1.5 text-text-2 transition-colors duration-200 hover:bg-surface-2 hover:text-foreground">
            Boundaries
          </Link>
        </nav>
      </div>
    </header>
  );
}
