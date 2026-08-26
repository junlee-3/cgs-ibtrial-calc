'use client';

import { PaperRow } from '@/components/PaperRow';
import { ScoreDial } from '@/components/ScoreDial';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { levelsFor } from '@/data/boundaries';
import { SUBJECTS } from '@/data/subjects';
import type { GroupDef, Level, SubjectId } from '@/data/types';
import { scoreSubject } from '@/lib/score';
import type { Action, GroupState } from '@/lib/state';

interface GroupCardProps {
  group: GroupDef;
  state: GroupState;
  duplicate: boolean;
  dispatch: (action: Action) => void;
}

export function GroupCard({ group, state, duplicate, dispatch }: GroupCardProps) {
  const options = [...group.subjects].sort((a, b) => SUBJECTS[a].name.localeCompare(SUBJECTS[b].name));
  const subjectItems = options.map((id) => ({ value: id, label: SUBJECTS[id].name }));
  const levels = state.subjectId ? levelsFor(state.subjectId) : [];
  const ready = state.subjectId !== undefined && state.level !== undefined;
  const result = ready ? scoreSubject(state.subjectId as SubjectId, state.level as Level, state.marks) : null;

  return (
    <Card className="gap-4 p-6">
      <h3 className="font-display text-lg font-bold">{group.label}</h3>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Select items={subjectItems} value={state.subjectId ?? null} onValueChange={(v) => dispatch({ type: 'setSubject', group: group.key, subjectId: v as SubjectId })}>
          <SelectTrigger className="w-full rounded-2xl bg-muted sm:min-w-[260px]" aria-label={`${group.label} subject`}>
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            {options.map((id) => (
              <SelectItem key={id} value={id}>
                {SUBJECTS[id].name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state.subjectId && levels.length > 1 && (
          <Select items={levels.map((level) => ({ value: level, label: level }))} value={state.level ?? null} onValueChange={(v) => dispatch({ type: 'setLevel', group: group.key, level: v as Level })}>
            <SelectTrigger className="w-full rounded-2xl bg-muted sm:w-[140px]" aria-label={`${group.label} level`}>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {state.subjectId && levels.length === 1 && (
          <span className="inline-flex items-center rounded-2xl bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">{levels[0]} only</span>
        )}
      </div>
      {duplicate && <p className="text-sm text-destructive">This subject is already selected in another group.</p>}
      {result && state.subjectId && (
        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <div className="flex items-center gap-4 py-2">
            <ScoreDial grade={result.grade} />
            <div>
              <p>
                <span className="font-medium">Total Weighted Score:</span> {result.rounded}/100
              </p>
              <p>
                <span className="font-medium">Predicted IB Grade:</span> {result.grade}/7
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {result.rows.map(({ component, weight }) => (
              <PaperRow
                key={component.name}
                label={component.name}
                weight={weight}
                max={component.maxMarks}
                value={state.marks[component.name] ?? 0}
                onChange={(value) => dispatch({ type: 'setMark', group: group.key, component: component.name, value })}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
