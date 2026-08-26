'use client';

import { PaperRow } from '@/components/PaperRow';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CORE_MATRIX, corePoints, EE_BOUNDS, EE_MAX, LETTERS, letterIndex, TOK_BOUNDS, TOK_MAX, tokScore } from '@/lib/core';
import type { Action } from '@/lib/state';

interface CoreSectionProps {
  tok: { essay: number; exhibition: number };
  ee: number;
  dispatch: (action: Action) => void;
}

function ScoreBox({ score, letter }: { score: string; letter: string }) {
  return (
    <div className="my-2 flex items-center justify-between rounded-xl bg-muted p-4">
      <div>
        <p className="text-sm text-muted-foreground">Score</p>
        <p className="text-lg font-semibold">{score}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-muted-foreground">Awarded Grade</p>
        <p className="text-2xl font-semibold">{letter}</p>
      </div>
    </div>
  );
}

const cellClass = (v: number | null) =>
  v === null
    ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
    : v === 3
      ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-500/30 dark:text-emerald-200'
      : v === 2
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
        : v === 1
          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300'
          : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300';

export function CoreSection({ tok, ee, dispatch }: CoreSectionProps) {
  const tokTotal = tokScore(tok.essay, tok.exhibition);
  const tokIdx = letterIndex(tokTotal, TOK_BOUNDS);
  const eeIdx = letterIndex(ee, EE_BOUNDS);
  const points = corePoints(eeIdx, tokIdx);
  const display = [...LETTERS].reverse(); // A, B, C, D, E

  return (
    <Card className="p-6 shadow-[var(--shadow-1)]">
      <h3 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">Core Components</h3>
      <section>
        <h4 className="mb-2 text-lg font-semibold text-foreground">Theory of Knowledge</h4>
        <ScoreBox score={`${tokTotal}/${TOK_MAX}`} letter={LETTERS[tokIdx]} />
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <PaperRow label="Theory of Knowledge essay" weight={2 / 3} value={tok.essay} max={10} onChange={(value) => dispatch({ type: 'setTok', field: 'essay', value })} />
          <PaperRow label="Theory of Knowledge exhibition" weight={1 / 3} value={tok.exhibition} max={10} onChange={(value) => dispatch({ type: 'setTok', field: 'exhibition', value })} />
        </div>
      </section>
      <section className="mt-10">
        <h4 className="mb-2 text-lg font-semibold text-foreground">Extended Essay</h4>
        <ScoreBox score={`${ee}/${EE_MAX}`} letter={LETTERS[eeIdx]} />
        <PaperRow label="Extended Essay" weight={1} value={ee} max={EE_MAX} onChange={(value) => dispatch({ type: 'setEE', value })} />
      </section>
      <section className="mt-10">
        <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
          Core Points: <span className="font-semibold text-coral-text">{points === 'fail' ? 'Fail' : points}</span>
        </h4>
        <div className="overflow-x-auto">
          <div
            className="grid min-w-[320px] grid-cols-6 gap-px overflow-hidden rounded-xl border-2 border-border bg-border text-center text-sm"
            role="table"
            aria-label="Core points matrix (rows: Extended Essay, columns: Theory of Knowledge)"
          >
            <div role="row" className="contents">
              <div role="columnheader" className="bg-background p-2 text-xs text-muted-foreground">
                EE \ TOK
              </div>
              {display.map((l) => (
                <div key={`h-${l}`} role="columnheader" className="bg-background p-2 font-bold">
                  {l}
                </div>
              ))}
            </div>
            {display.map((eeLetter) => {
              const eeI = LETTERS.indexOf(eeLetter);
              return (
                <div key={`r-${eeLetter}`} role="row" className="contents">
                  <div role="rowheader" className="bg-background p-2 font-bold">
                    {eeLetter}
                  </div>
                  {display.map((tokLetter) => {
                    const tokI = LETTERS.indexOf(tokLetter);
                    const v = CORE_MATRIX[eeI][tokI];
                    const active = eeI === eeIdx && tokI === tokIdx;
                    return (
                      <div
                        key={`c-${eeLetter}-${tokLetter}`}
                        role="cell"
                        className={cn('p-2 font-medium', cellClass(v), active && 'ring-2 ring-inset ring-primary')}
                      >
                        {v === null ? 'Fail' : v}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Card>
  );
}
