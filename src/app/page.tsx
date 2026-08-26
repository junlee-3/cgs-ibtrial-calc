import Link from 'next/link';
import { Calculator } from '@/components/Calculator';
import { Reveal } from '@/components/Reveal';

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
      <Reveal>
        <header className="max-w-2xl">
          <p className="eyebrow">Canberra Grammar School · IB Diploma</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Estimate your <span className="text-coral-text">IB score</span>
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-text-2 sm:text-lg">
            Enter trial exam marks and see predicted IB grades from the CGS 2026 three-year-average boundaries. Exam papers only — IAs are not counted.
          </p>
        </header>
      </Reveal>

      <Reveal delay={0.06}>
        <Link
          href="/boundaries"
          className="surface-card mt-8 flex items-center justify-between gap-4 p-5 transition-[box-shadow,transform] duration-200 ease-[var(--ease-brand)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-2)] focus-visible:outline-none"
        >
          <span>
            <span className="block text-base font-semibold text-foreground">Grade boundaries</span>
            <span className="mt-0.5 block text-sm text-text-2">See the CGS boundaries used for every subject</span>
          </span>
          <span
            aria-hidden
            className="flex size-9 items-center justify-center rounded-full bg-coral-light font-medium text-coral-text"
          >
            →
          </span>
        </Link>
      </Reveal>

      <Calculator />
    </main>
  );
}
