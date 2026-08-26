import { describe, expect, it } from 'vitest';
import { BOUNDARIES, levelsFor } from '@/data/boundaries';
import { SUBJECT_IDS } from '@/data/types';

describe('BOUNDARIES', () => {
  it('has 49 subject/level rows', () => {
    const rows = SUBJECT_IDS.flatMap((id) => Object.keys(BOUNDARIES[id]));
    expect(rows).toHaveLength(49);
  });

  it('every row has 7 strictly increasing lower bounds from 0 to <= 100', () => {
    for (const id of SUBJECT_IDS) {
      for (const [level, bounds] of Object.entries(BOUNDARIES[id])) {
        expect(bounds, `${id} ${level}`).toHaveLength(7);
        expect(bounds[0], `${id} ${level}`).toBe(0);
        for (let i = 1; i < 7; i++) {
          expect(bounds[i], `${id} ${level} g${i + 1}`).toBeGreaterThan(bounds[i - 1]);
        }
        expect(bounds[6], `${id} ${level}`).toBeLessThanOrEqual(100);
      }
    }
  });

  it('matches spot-checked PDF rows', () => {
    expect(BOUNDARIES.physics.HL).toEqual([0, 14, 24, 37, 48, 58, 69]);
    expect(BOUNDARIES['english-lal'].SL).toEqual([0, 13, 28, 41, 51, 68, 82]);
    expect(BOUNDARIES['global-politics'].SL).toEqual([0, 9, 21, 32, 43, 56, 66]);
    expect(BOUNDARIES['visual-arts'].SL).toEqual([0, 11, 22, 34, 50, 65, 80]);
  });

  it('levelsFor lists SL before HL and only existing levels', () => {
    expect(levelsFor('physics')).toEqual(['SL', 'HL']);
    expect(levelsFor('french-b')).toEqual(['SL']);
    expect(levelsFor('french-ab')).toEqual(['SL']);
  });
});
