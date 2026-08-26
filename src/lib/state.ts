import { levelsFor } from '@/data/boundaries';
import { GROUP_KEYS } from '@/data/groups';
import { examComponents } from '@/data/subjects';
import { SUBJECT_IDS, type GroupKey, type Level, type SubjectId } from '@/data/types';
import { EE_MAX } from '@/lib/core';
import { clampMark, type Marks } from '@/lib/score';

export interface GroupState {
  subjectId?: SubjectId;
  level?: Level;
  marks: Marks;
}

export interface CalculatorState {
  groups: Record<GroupKey, GroupState>;
  tok: { essay: number; exhibition: number };
  ee: number;
}

export const initialState: CalculatorState = {
  groups: Object.fromEntries(GROUP_KEYS.map((k) => [k, { marks: {} }])) as Record<GroupKey, GroupState>,
  tok: { essay: 0, exhibition: 0 },
  ee: 0,
};

/** Rebuild a possibly-stale persisted state so it satisfies the reducer's invariants. */
export function sanitize(raw: CalculatorState): CalculatorState {
  const groups = Object.fromEntries(
    GROUP_KEYS.map((key) => {
      const g = (raw.groups?.[key] ?? {}) as Partial<GroupState>;
      const subjectId =
        typeof g.subjectId === 'string' && (SUBJECT_IDS as readonly string[]).includes(g.subjectId) ? (g.subjectId as SubjectId) : undefined;
      const levels = subjectId ? levelsFor(subjectId) : [];
      const level: Level | undefined = g.level && levels.includes(g.level) ? g.level : levels.length === 1 ? levels[0] : undefined;
      const marks: Marks = {};
      if (subjectId && level && g.marks && typeof g.marks === 'object') {
        for (const c of examComponents(subjectId, level)) {
          const v = (g.marks as Record<string, unknown>)[c.name];
          if (typeof v === 'number') marks[c.name] = clampMark(v, c.maxMarks);
        }
      }
      return [key, { subjectId, level, marks }];
    }),
  ) as Record<GroupKey, GroupState>;
  return {
    groups,
    tok: { essay: clampMark(Number(raw.tok?.essay ?? 0), 10), exhibition: clampMark(Number(raw.tok?.exhibition ?? 0), 10) },
    ee: clampMark(Number(raw.ee ?? 0), EE_MAX),
  };
}

export type Action =
  | { type: 'setSubject'; group: GroupKey; subjectId: SubjectId | undefined }
  | { type: 'setLevel'; group: GroupKey; level: Level }
  | { type: 'setMark'; group: GroupKey; component: string; value: number }
  | { type: 'setTok'; field: 'essay' | 'exhibition'; value: number }
  | { type: 'setEE'; value: number }
  | { type: 'reset' }
  | { type: 'hydrate'; state: CalculatorState };

export function reducer(state: CalculatorState, action: Action): CalculatorState {
  switch (action.type) {
    case 'setSubject': {
      const levels = action.subjectId ? levelsFor(action.subjectId) : [];
      const level = levels.length === 1 ? levels[0] : undefined;
      return { ...state, groups: { ...state.groups, [action.group]: { subjectId: action.subjectId, level, marks: {} } } };
    }
    case 'setLevel': {
      const g = state.groups[action.group];
      return { ...state, groups: { ...state.groups, [action.group]: { subjectId: g.subjectId, level: action.level, marks: {} } } };
    }
    case 'setMark': {
      const g = state.groups[action.group];
      if (!g.subjectId || !g.level) return state;
      const component = examComponents(g.subjectId, g.level).find((c) => c.name === action.component);
      if (!component) return state;
      return {
        ...state,
        groups: {
          ...state.groups,
          [action.group]: { ...g, marks: { ...g.marks, [action.component]: clampMark(action.value, component.maxMarks) } },
        },
      };
    }
    case 'setTok':
      return { ...state, tok: { ...state.tok, [action.field]: clampMark(action.value, 10) } };
    case 'setEE':
      return { ...state, ee: clampMark(action.value, EE_MAX) };
    case 'reset':
      return initialState;
    case 'hydrate':
      return sanitize(action.state);
  }
}
