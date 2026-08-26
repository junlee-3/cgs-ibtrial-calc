import { describe, expect, it } from 'vitest';
import {
  corePoints,
  diplomaFailures,
  EE_BOUNDS,
  LETTERS,
  letterIndex,
  statusLabel,
  tagline,
  TOK_BOUNDS,
  tokScore,
  totalPoints,
  type SubjectResult,
} from '@/lib/core';

const A = 4, B = 3, C = 2, D = 1, E = 0;

describe('letters', () => {
  it('TOK score is 2*essay + exhibition, clamped to /10 each', () => {
    expect(tokScore(10, 10)).toBe(30);
    expect(tokScore(12, -1)).toBe(20);
  });

  it('maps TOK /30 to letters at the thresholds', () => {
    expect(LETTERS[letterIndex(22, TOK_BOUNDS)]).toBe('A');
    expect(LETTERS[letterIndex(21, TOK_BOUNDS)]).toBe('B');
    expect(LETTERS[letterIndex(16, TOK_BOUNDS)]).toBe('B');
    expect(LETTERS[letterIndex(15, TOK_BOUNDS)]).toBe('C');
    expect(LETTERS[letterIndex(10, TOK_BOUNDS)]).toBe('C');
    expect(LETTERS[letterIndex(9, TOK_BOUNDS)]).toBe('D');
    expect(LETTERS[letterIndex(4, TOK_BOUNDS)]).toBe('D');
    expect(LETTERS[letterIndex(3, TOK_BOUNDS)]).toBe('E');
    expect(LETTERS[letterIndex(0, TOK_BOUNDS)]).toBe('E');
  });

  it('maps EE /34 to letters at the thresholds', () => {
    expect(LETTERS[letterIndex(26, EE_BOUNDS)]).toBe('A');
    expect(LETTERS[letterIndex(25, EE_BOUNDS)]).toBe('B');
    expect(LETTERS[letterIndex(13, EE_BOUNDS)]).toBe('C');
    expect(LETTERS[letterIndex(6, EE_BOUNDS)]).toBe('D');
    expect(LETTERS[letterIndex(5, EE_BOUNDS)]).toBe('E');
  });
});

describe('corePoints', () => {
  it('follows the IB matrix', () => {
    expect(corePoints(A, A)).toBe(3);
    expect(corePoints(A, B)).toBe(3);
    expect(corePoints(B, A)).toBe(3);
    expect(corePoints(B, B)).toBe(2);
    expect(corePoints(C, D)).toBe(0);
    expect(corePoints(D, B)).toBe(1);
    expect(corePoints(D, D)).toBe(0);
    expect(corePoints(E, A)).toBe('fail');
    expect(corePoints(A, E)).toBe('fail');
  });
});

const subj = (level: 'SL' | 'HL', grade: number, subjectId: SubjectResult['subjectId'] = 'physics'): SubjectResult => ({ subjectId, level, grade });

const six = (hl: number[], sl: number[]): SubjectResult[] => {
  const ids: SubjectResult['subjectId'][] = ['english-lal', 'chinese-b', 'history', 'physics', 'maths-aa', 'music'];
  return [...hl.map((g) => ['HL', g] as const), ...sl.map((g) => ['SL', g] as const)].map(([level, grade], i) => subj(level, grade, ids[i]));
};

describe('totalPoints', () => {
  it('sums grades plus core points, counting a fail as 0', () => {
    expect(totalPoints(six([6, 6, 6], [5, 5, 5]), 2)).toBe(35);
    expect(totalPoints(six([6, 6, 6], [5, 5, 5]), 'fail')).toBe(33);
  });
});

describe('diplomaFailures', () => {
  it('requires six subjects', () => {
    expect(diplomaFailures(six([6, 6], [5, 5, 5]), 2)).toEqual(['Select exactly 6 subjects']);
  });

  it('passes a healthy selection', () => {
    expect(diplomaFailures(six([6, 6, 6], [5, 5, 5]), 2)).toEqual([]);
  });

  it('flags each rule', () => {
    expect(diplomaFailures(six([6, 6], [5, 5, 5, 5]), 2)).toContain('You must take at least 3 HL subjects.');
    expect(diplomaFailures(six([3, 3, 3], [3, 3, 3]), 2)).toContain('Less than 24 total points.');
    expect(diplomaFailures(six([7, 7, 7], [7, 7, 1]), 3)).toContain('Cannot have any grade 1.');
    expect(diplomaFailures(six([7, 7, 7], [2, 2, 2]), 3)).toContain('More than two grade 2s.');
    expect(diplomaFailures(six([7, 3, 3], [3, 3, 7]), 3)).toContain('More than three grade 3s.');
    expect(diplomaFailures(six([3, 4, 4], [7, 7, 7]), 3)).toContain('Less than 12 HL points.');
    expect(diplomaFailures(six([3, 3, 3, 3], [7, 7]), 3)).toContain('Less than 12 points across the three highest HLs.');
    expect(diplomaFailures(six([7, 7, 7], [3, 3, 2]), 3)).toContain('Less than 9 SL points.');
    expect(diplomaFailures(six([7, 7, 7, 7], [2, 2]), 3)).toContain('Less than 5 SL points.');
    expect(diplomaFailures(six([7, 7, 7], [7, 7, 7]), 'fail')).toContain('TOK or EE grade is E (automatic fail).');
  });

  it('uses the best three HLs when four are taken', () => {
    expect(diplomaFailures(six([5, 5, 5, 2], [6, 6]), 3)).not.toContain('Less than 12 points across the three highest HLs.');
  });

  it('flags a subject chosen twice', () => {
    const dup = six([6, 6, 6], [5, 5, 5]);
    dup[5] = subj('SL', 5, 'physics');
    expect(diplomaFailures(dup, 2)).toContain('Your subject selection does not meet IB Diploma requirements. (Physics is chosen twice.)');
  });
});

describe('tagline and status', () => {
  it('matches RevisionDojo copy', () => {
    expect(tagline(5, [], 30)).toBe('Pick all six subjects to get a prediction.');
    expect(tagline(6, [], 41)).toBe('Top of the cohort. Keep it up.');
    expect(tagline(6, [], 36)).toBe("Strong score – you're doing well.");
    expect(tagline(6, [], 30)).toBe('On track for the diploma.');
    expect(tagline(6, ['Less than 24 total points.'], 20)).toBe('Diploma at risk – see what to fix below.');
    expect(statusLabel(4, [])).toBe('Select 2 more subjects');
    expect(statusLabel(6, [])).toBe('Diploma awarded');
    expect(statusLabel(6, ['x'])).toBe('Diploma not awarded');
  });
});
