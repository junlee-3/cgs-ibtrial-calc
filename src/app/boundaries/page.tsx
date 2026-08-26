import type { Metadata } from 'next';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BOUNDARIES, levelsFor } from '@/data/boundaries';
import { GROUPS } from '@/data/groups';
import { SUBJECTS } from '@/data/subjects';
import type { SubjectId } from '@/data/types';

export const metadata: Metadata = { title: 'Grade boundaries · CGS IB Trial Grade Calculator' };

/** Each subject listed once, under its home group (ESS under Group 3, per the PDF's "3/4" row order). */
const HOME_GROUP: Record<string, SubjectId[]> = {
  g1: ['english-lal', 'english-lit'],
  g2: ['chinese-b', 'french-ab', 'french-b', 'german-b', 'indonesian-ab', 'latin', 'spanish-ab'],
  g3: ['business', 'economics', 'geography', 'global-politics', 'history', 'philosophy', 'psychology', 'ess'],
  g4: ['biology', 'chemistry', 'computer-science', 'physics', 'sehs'],
  g5: ['maths-aa', 'maths-ai'],
  g6: ['music', 'theatre', 'visual-arts'],
};

function range(lower: number, next: number | undefined): string {
  return next === undefined ? `${lower}–100` : `${lower}–${next - 1}`;
}

export default function BoundariesPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-20 pt-8 sm:px-6 sm:pt-10">
      <Link href="/" className="text-sm font-medium text-sky hover:text-primary">
        ← Back to the calculator
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">CGS IB grade boundaries 2026</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">Three-year average, as a percentage of the subject&apos;s exam papers. Whole percentages; a mark on a boundary earns the higher grade.</p>
      {GROUPS.map((g) => (
        <section key={g.key} className="mt-10">
          <h2 className="mb-3 font-display text-xl font-semibold text-primary">{g.label}</h2>
          <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                    <TableHead key={n} className="text-right">
                      Grade {n}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {HOME_GROUP[g.key].flatMap((id) =>
                  [...levelsFor(id)].reverse().map((level) => {
                    const b = BOUNDARIES[id][level]!;
                    return (
                      <TableRow key={`${id}-${level}`}>
                        <TableCell className="whitespace-nowrap">
                          {SUBJECTS[id].name} {level}
                        </TableCell>
                        {b.map((lower, i) => (
                          <TableCell key={i} className="text-right">
                            {range(lower, b[i + 1])}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  }),
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      ))}
    </main>
  );
}
