'use client';

import { useEffect, useReducer, useState } from 'react';
import { CoreSection } from '@/components/CoreSection';
import { GroupCard } from '@/components/GroupCard';
import { Scoresheet } from '@/components/Scoresheet';
import { StepHeading } from '@/components/StepHeading';
import { GROUPS } from '@/data/groups';
import { corePoints, EE_BOUNDS, letterIndex, TOK_BOUNDS, tokScore, type SubjectResult } from '@/lib/core';
import { scoreSubject } from '@/lib/score';
import { initialState, reducer } from '@/lib/state';
import { loadState, saveState } from '@/lib/storage';

export function Calculator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadState();
    if (saved) dispatch({ type: 'hydrate', state: saved });
    // Mount-detection flag for the SSR/CSR hydration guard (see brief); it can only be set here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

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
      <StepHeading number={1} label="Enter your subject marks" />
      <div className="space-y-4">
        {GROUPS.map((g) => (
          <GroupCard
            key={g.key}
            group={g}
            state={state.groups[g.key]}
            duplicate={state.groups[g.key].subjectId !== undefined && (counts.get(state.groups[g.key].subjectId as string) ?? 0) > 1}
            dispatch={dispatch}
          />
        ))}
      </div>
      <StepHeading number={2} label="Core points: EE and TOK marks" />
      <CoreSection tok={state.tok} ee={state.ee} dispatch={dispatch} />
      <StepHeading number={3} label="Results sheet" />
      <Scoresheet subjects={subjects} tokIdx={tokIdx} eeIdx={eeIdx} core={core} onReset={() => dispatch({ type: 'reset' })} />
    </div>
  );
}
