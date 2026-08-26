import Link from 'next/link';
import { Calculator } from '@/components/Calculator';

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-24 pt-10 sm:px-6">
      <header className="text-center">
        <span className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          CGS 2026 boundaries · 3-year average
        </span>
        <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          Estimate your{' '}
          <span className="text-primary underline decoration-primary/40 decoration-[6px] underline-offset-4">IB Score</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-muted-foreground">
          Predict your IB grades from your trial exam marks using CGS&apos;s 2026 grade boundaries. Exam papers only — IAs are not counted.
        </p>
      </header>
      <Link
        href="/boundaries"
        className="mt-10 flex items-center justify-between rounded-2xl border border-border p-5 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
      >
        <span>
          <span className="block text-lg font-medium">Grade boundaries</span>
          <span className="block text-sm text-muted-foreground">View the boundaries used for every subject</span>
        </span>
        <span aria-hidden className="text-muted-foreground">→</span>
      </Link>
      <Calculator />
    </main>
  );
}
