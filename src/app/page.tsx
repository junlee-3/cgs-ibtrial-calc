import Link from 'next/link';
import { Calculator } from '@/components/Calculator';
import { Reveal } from '@/components/Reveal';

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <Reveal>
        <header className="text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-sky/25 bg-white/70 px-3.5 py-1 text-xs font-semibold tracking-wide text-sky uppercase">
            <span className="size-1.5 rounded-full bg-gold" aria-hidden />
            Canberra Grammar School · IB Diploma
          </p>
          <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Estimate your <span className="text-sky">IB score</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Enter your trial exam marks and see predicted IB grades from the CGS 2026 three-year-average boundaries. Exam papers only — IAs are not counted.
          </p>
        </header>
      </Reveal>

      <Reveal delay={0.08}>
        <Link
          href="/boundaries"
          className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-border bg-white/80 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <span>
            <span className="block font-display text-lg font-semibold text-primary">Grade boundaries</span>
            <span className="block text-sm text-muted-foreground">See the CGS boundaries used for every subject</span>
          </span>
          <span aria-hidden className="flex size-9 items-center justify-center rounded-full bg-muted text-sky">
            →
          </span>
        </Link>
      </Reveal>

      <Calculator />
    </main>
  );
}
