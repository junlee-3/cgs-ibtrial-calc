import { levelsFor } from '@/data/boundaries';
import { GROUP_KEYS } from '@/data/groups';
import { examComponents } from '@/data/subjects';
import type { GroupKey, Level, SubjectId } from '@/data/types';
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
      return action.state;
  }
}
