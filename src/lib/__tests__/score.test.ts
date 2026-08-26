import { describe, expect, it } from 'vitest';
import { examComponents } from '@/data/subjects';
import { clampMark, gradeFor, roundPercent, scoreSubject, trialWeights, weightedPercent } from '@/lib/score';

describe('clampMark', () => {
  it('clamps to [0, max] and rounds to an integer', () => {
    expect(clampMark(-5, 40)).toBe(0);
    expect(clampMark(45, 40)).toBe(40);
    expect(clampMark(12.6, 40)).toBe(13);
    expect(clampMark(Number.NaN, 40)).toBe(0);
  });
});

describe('trialWeights', () => {
  it('rescales exam weights to sum to 1', () => {
    const w = trialWeights(examComponents('physics', 'HL'));
    expect(w.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 9);
    expect(w).toEqual([0.3, 0.15, 0.55].map((x) => expect.closeTo(x, 9)));
  });

  it('gives 33.3% each for Language B papers', () => {
    const w = trialWeights(examComponents('chinese-b', 'SL'));
    expect(w).toEqual([1 / 3, 1 / 3, 1 / 3].map((x) => expect.closeTo(x, 9)));
  });

  it('returns zeros for an empty list', () => {
    expect(trialWeights([])).toEqual([]);
  });
});

describe('weightedPercent', () => {
  it('computes the spec worked example (Physics HL 30/40, 15/20, 60/90 -> 70.4)', () => {
    const comps = examComponents('physics', 'HL');
    const pct = weightedPercent(comps, { 'Paper 1A: Multiple choice': 30, 'Paper 1B: Data-based': 15, 'Paper 2': 60 });
    expect(pct).toBeCloseTo(70.42, 1);
  });

  it('treats missing marks as 0 and clamps over-max marks', () => {
    const comps = examComponents('maths-aa', 'SL');
    expect(weightedPercent(comps, {})).toBe(0);
    expect(weightedPercent(comps, { 'Paper 1 (no calculator)': 999, 'Paper 2': 80 })).toBeCloseTo(100, 9);
  });
});

describe('roundPercent', () => {
  it('rounds exact .5 ties up even when float arithmetic lands just below', () => {
    expect(roundPercent(69.49999999999999)).toBe(70);
    expect(roundPercent(69.4)).toBe(69);
    expect(roundPercent(68.5)).toBe(69);
  });
});

describe('gradeFor', () => {
  const bounds = [0, 14, 24, 37, 48, 58, 69] as const; // Physics HL

  it('returns the highest grade whose lower bound is cleared', () => {
    expect(gradeFor(0, bounds)).toBe(1);
    expect(gradeFor(13, bounds)).toBe(1);
    expect(gradeFor(14, bounds)).toBe(2);
    expect(gradeFor(68, bounds)).toBe(6);
    expect(gradeFor(69, bounds)).toBe(7);
    expect(gradeFor(100, bounds)).toBe(7);
  });

  it('rounds to the nearest whole percent first', () => {
    expect(gradeFor(68.5, bounds)).toBe(7);
    expect(gradeFor(68.4, bounds)).toBe(6);
  });
});

describe('scoreSubject', () => {
  it('returns percent, grade and one row per exam component with trial weights', () => {
    const r = scoreSubject('physics', 'HL', { 'Paper 1A: Multiple choice': 30, 'Paper 1B: Data-based': 15, 'Paper 2': 60 });
    expect(r.percent).toBeCloseTo(70.42, 1);
    expect(r.grade).toBe(7);
    expect(r.rows.map((x) => x.component.name)).toEqual(['Paper 1A: Multiple choice', 'Paper 1B: Data-based', 'Paper 2']);
    expect(r.rows.map((x) => x.weight)).toEqual([0.3, 0.15, 0.55].map((x) => expect.closeTo(x, 9)));
  });

  it('gives grade 1 with no marks and grade 7 with full marks', () => {
    expect(scoreSubject('history', 'SL', {}).grade).toBe(1);
    expect(scoreSubject('history', 'SL', { 'Paper 1': 24, 'Paper 2': 30 }).grade).toBe(7);
  });

  it('scores an arts subject from the single trial mark', () => {
    expect(scoreSubject('music', 'SL', { 'Trial mark': 78 }).grade).toBe(7);
    expect(scoreSubject('music', 'SL', { 'Trial mark': 77 }).grade).toBe(6);
  });

  it('throws for a level the school does not offer', () => {
    expect(() => scoreSubject('french-b', 'HL', {})).toThrow();
  });

  it('regression: Chinese B SL 30/30, 19/25, 13/40 is exactly 69.5 → 70 → grade 6', () => {
    const r = scoreSubject('chinese-b', 'SL', { 'Paper 1: Writing': 30, 'Paper 2: Listening': 19, 'Paper 2: Reading': 13 });
    expect(r.rounded).toBe(70);
    expect(r.grade).toBe(6);
  });
});
