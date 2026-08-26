'use client';

import { AnimatedTotal } from '@/components/AnimatedTotal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SUBJECTS } from '@/data/subjects';
import { diplomaFailures, LETTERS, statusLabel, tagline, totalPoints, type SubjectResult } from '@/lib/core';
import { gradeHue } from '@/lib/gradeColor';

interface ScoresheetProps {
  subjects: SubjectResult[];
  tokIdx: number;
  eeIdx: number;
  core: number | 'fail';
  onReset: () => void;
}

export function Scoresheet({ subjects, tokIdx, eeIdx, core, onReset }: ScoresheetProps) {
  const failures = diplomaFailures(subjects, core);
  const total = totalPoints(subjects, core);
  const hl = subjects.filter((s) => s.level === 'HL').length;
  const sl = subjects.length - hl;
  const complete = subjects.length === 6;
  const awarded = complete && failures.length === 0;

  return (
    <Card className="border-sky/15 p-6 shadow-sm ring-1 ring-sky/10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl font-bold text-primary">Scoresheet</h3>
          <Badge variant={awarded ? 'default' : 'secondary'} className="mt-2">
            {statusLabel(subjects.length, failures)}
          </Badge>
        </div>
        <div className="text-right">
          <AnimatedTotal value={total} />
          <span className="text-lg text-muted-foreground">/45</span>
          <p className="text-sm text-muted-foreground">{tagline(subjects.length, failures, total)}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-between text-sm text-muted-foreground">
        <p>
          {hl} HL · {sl} SL
        </p>
        <p>CGS 2026</p>
      </div>
      <Table className="mt-2">
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead className="text-right">Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center text-muted-foreground">
                No subjects selected yet.
              </TableCell>
            </TableRow>
          ) : (
            subjects.map((s, i) => (
              <TableRow key={`${s.subjectId}-${i}`}>
                <TableCell>
                  {s.level} {SUBJECTS[s.subjectId].name}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums" style={{ color: gradeHue(s.grade) }}>
                  {s.grade}
                </TableCell>
              </TableRow>
            ))
          )}
          <TableRow>
            <TableCell>Theory of Knowledge</TableCell>
            <TableCell className="text-right">{LETTERS[tokIdx]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Extended Essay</TableCell>
            <TableCell className="text-right">{LETTERS[eeIdx]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Core points</TableCell>
            <TableCell className="text-right">{core === 'fail' ? 'Fail' : `${core}/3`}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {complete && failures.length > 0 && (
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-destructive">
          {failures.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}
      <div className="mt-6 flex justify-end">
        <Button variant="outline" size="sm" onClick={onReset}>
          Reset all marks
        </Button>
      </div>
    </Card>
  );
}
