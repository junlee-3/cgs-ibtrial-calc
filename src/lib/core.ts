import { SUBJECTS } from '@/data/subjects';
import type { Level, SubjectId } from '@/data/types';
import { clampMark } from '@/lib/score';

export const LETTERS = ['E', 'D', 'C', 'B', 'A'] as const;
export type Letter = (typeof LETTERS)[number];

export const TOK_MAX = 30;
export const EE_MAX = 34;
/** Lower bounds for E, D, C, B, A on the TOK /30 and EE /34 scales. */
export const TOK_BOUNDS = [0, 4, 10, 16, 22] as const;
export const EE_BOUNDS = [0, 6, 13, 20, 26] as const;

/** 0 = E … 4 = A. */
export function letterIndex(score: number, bounds: readonly number[]): number {
  return bounds.reduce((idx, lower, i) => (score >= lower ? i : idx), 0);
}

/** TOK essay /10 counts twice, exhibition /10 once → /30. */
export function tokScore(essay: number, exhibition: number): number {
  return 2 * clampMark(essay, 10) + clampMark(exhibition, 10);
}

/** CORE_MATRIX[eeIdx][tokIdx]; null = failing condition. Index order E, D, C, B, A. */
export const CORE_MATRIX: readonly (readonly (number | null)[])[] = [
  [null, null, null, null, null],
  [null, 0, 0, 1, 2],
  [null, 0, 1, 2, 2],
  [null, 1, 2, 2, 3],
  [null, 2, 2, 3, 3],
];

export function corePoints(eeIdx: number, tokIdx: number): number | 'fail' {
  const v = CORE_MATRIX[eeIdx]?.[tokIdx];
  return v === null || v === undefined ? 'fail' : v;
}

export interface SubjectResult {
  subjectId: SubjectId;
  level: Level;
  grade: number;
}

export function totalPoints(subjects: SubjectResult[], core: number | 'fail'): number {
  return subjects.reduce((sum, s) => sum + s.grade, 0) + (core === 'fail' ? 0 : core);
}

const sumTop = (grades: number[], n: number) =>
  [...grades].sort((a, b) => b - a).slice(0, n).reduce((a, b) => a + b, 0);

/** Failed IB Diploma conditions, in RevisionDojo's wording. Empty array = diploma awarded. */
export function diplomaFailures(subjects: SubjectResult[], core: number | 'fail'): string[] {
  if (subjects.length !== 6) return ['Select exactly 6 subjects'];
  const failures: string[] = [];
  const seen = new Map<SubjectId, number>();
  for (const s of subjects) seen.set(s.subjectId, (seen.get(s.subjectId) ?? 0) + 1);
  const duplicated = [...seen.entries()].filter(([, n]) => n > 1).map(([id]) => SUBJECTS[id].name);
  if (duplicated.length > 0) {
    failures.push(`Your subject selection does not meet IB Diploma requirements. (${duplicated.join(' and ')} is chosen twice.)`);
  }
  const hl = subjects.filter((s) => s.level === 'HL').map((s) => s.grade);
  const sl = subjects.filter((s) => s.level === 'SL').map((s) => s.grade);
  const grades = subjects.map((s) => s.grade);
  if (hl.length < 3) failures.push('You must take at least 3 HL subjects.');
  if (core === 'fail') failures.push('TOK or EE grade is E (automatic fail).');
  if (totalPoints(subjects, core) < 24) failures.push('Less than 24 total points.');
  if (grades.includes(1)) failures.push('Cannot have any grade 1.');
  if (grades.filter((g) => g === 2).length > 2) failures.push('More than two grade 2s.');
  if (grades.filter((g) => g === 3).length > 3) failures.push('More than three grade 3s.');
  if (hl.length >= 3 && sumTop(hl, 3) < 12) {
    failures.push(hl.length === 3 ? 'Less than 12 HL points.' : 'Less than 12 points across the three highest HLs.');
  }
  if (sl.length === 3 && sumTop(sl, 3) < 9) failures.push('Less than 9 SL points.');
  if (sl.length === 2 && sumTop(sl, 2) < 5) failures.push('Less than 5 SL points.');
  return failures;
}

export function statusLabel(subjectCount: number, failures: string[]): string {
  if (subjectCount < 6) return `Select ${6 - subjectCount} more subject${6 - subjectCount === 1 ? '' : 's'}`;
  return failures.length === 0 ? 'Diploma awarded' : 'Diploma not awarded';
}

export function tagline(subjectCount: number, failures: string[], total: number): string {
  if (subjectCount < 6) return 'Pick all six subjects to get a prediction.';
  if (failures.length > 0) return 'Diploma at risk – see what to fix below.';
  if (total >= 40) return 'Top of the cohort. Keep it up.';
  if (total >= 35) return "Strong score – you're doing well.";
  return 'On track for the diploma.';
}
