import { BOUNDARIES } from '@/data/boundaries';
import { examComponents } from '@/data/subjects';
import type { Bounds, Component, Level, SubjectId } from '@/data/types';

/** Raw marks keyed by component name. */
export type Marks = Record<string, number>;

export interface SubjectScore {
  /** Weighted trial percentage, 0–100, unrounded. */
  percent: number;
  /** IB grade 1–7 from the school boundaries. */
  grade: number;
  rows: { component: Component; weight: number }[];
}

export function clampMark(value: number, max: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(0, Math.round(value)), max);
}

/** Exam-only weights rescaled so they sum to 1 (the IA share is redistributed pro-rata). */
export function trialWeights(components: Component[]): number[] {
  const total = components.reduce((sum, c) => sum + c.ibWeight, 0);
  if (total === 0) return components.map(() => 0);
  return components.map((c) => c.ibWeight / total);
}

export function weightedPercent(components: Component[], marks: Marks): number {
  const weights = trialWeights(components);
  return components.reduce((sum, c, i) => {
    const mark = clampMark(marks[c.name] ?? 0, c.maxMarks);
    return sum + (mark / c.maxMarks) * weights[i] * 100;
  }, 0);
}

/** Highest grade whose lower bound the rounded percent clears; always at least 1. */
export function gradeFor(percent: number, bounds: Bounds): number {
  const p = Math.round(percent);
  return bounds.reduce((grade, lower, i) => (p >= lower ? i + 1 : grade), 1);
}

export function scoreSubject(id: SubjectId, level: Level, marks: Marks): SubjectScore {
  const bounds = BOUNDARIES[id][level];
  if (!bounds) throw new Error(`No boundaries for ${id} ${level}`);
  const components = examComponents(id, level);
  const weights = trialWeights(components);
  const percent = weightedPercent(components, marks);
  return {
    percent,
    grade: gradeFor(percent, bounds),
    rows: components.map((component, i) => ({ component, weight: weights[i] })),
  };
}
