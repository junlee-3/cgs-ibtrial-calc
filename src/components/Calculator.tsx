'use client';

import { CoreSection } from '@/components/CoreSection';
import { GroupCard } from '@/components/GroupCard';
import { Reveal } from '@/components/Reveal';
import { Scoresheet } from '@/components/Scoresheet';
import { StepHeading } from '@/components/StepHeading';
import { GROUPS } from '@/data/groups';
import { corePoints, EE_BOUNDS, letterIndex, TOK_BOUNDS, tokScore, type SubjectResult } from '@/lib/core';
import { scoreSubject } from '@/lib/score';
import { usePersistedCalculator } from '@/lib/usePersistedCalculator';

export function Calculator() {
  const [state, dispatch] = usePersistedCalculator();

  const chosenIds = GROUPS.map((g) => state.groups[g.key].subjectId).filter((id): id is NonNullable<typeof id> => id !== undefined);
  const counts = new Map<string, number>();
  for (const id of chosenIds) counts.set(id, (counts.get(id) ?? 0) + 1);

  const subjects: SubjectResult[] = GROUPS.flatMap((g) => {
    const gs = state.groups[g.key];
    if (!gs.subjectId || !gs.level) return [];
    return [{ subjectId: gs.subjectId, level: gs.level, grade: scoreSubject(gs.subjectId, gs.level, gs.marks).grade }];
  });

  const tokIdx = letterIndex(tokScore(state.tok.essay, state.tok.exhibition), TOK_BOUNDS);
  const eeIdx = letterIndex(state.ee, EE_BOUNDS);
  const core = corePoints(eeIdx, tokIdx);

  return (
    <div>
      <Reveal delay={0.12}>
        <StepHeading number={1} label="Enter your subject marks" />
      </Reveal>
      <div className="space-y-4">
        {GROUPS.map((g, i) => (
          <Reveal key={g.key} delay={0.04 * (i % 3)}>
            <GroupCard
              group={g}
              state={state.groups[g.key]}
              duplicate={state.groups[g.key].subjectId !== undefined && (counts.get(state.groups[g.key].subjectId as string) ?? 0) > 1}
              dispatch={dispatch}
            />
          </Reveal>
        ))}
      </div>
      <Reveal>
        <StepHeading number={2} label="Core points: EE and TOK marks" />
      </Reveal>
      <Reveal>
        <CoreSection tok={state.tok} ee={state.ee} dispatch={dispatch} />
      </Reveal>
      <Reveal>
        <StepHeading number={3} label="Results sheet" />
      </Reveal>
      <Reveal>
        <Scoresheet subjects={subjects} tokIdx={tokIdx} eeIdx={eeIdx} core={core} onReset={() => dispatch({ type: 'reset' })} />
      </Reveal>
    </div>
  );
}
