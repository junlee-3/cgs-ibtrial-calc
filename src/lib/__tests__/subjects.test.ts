import { describe, expect, it } from 'vitest';
import { BOUNDARIES, levelsFor } from '@/data/boundaries';
import { GROUPS, GROUP_KEYS } from '@/data/groups';
import { examComponents, SUBJECTS } from '@/data/subjects';
import { LEVELS, SUBJECT_IDS } from '@/data/types';

describe('SUBJECTS', () => {
  it('has a component list for exactly the levels that have boundaries', () => {
    for (const id of SUBJECT_IDS) {
      for (const level of LEVELS) {
        const hasBounds = BOUNDARIES[id][level] !== undefined;
        const hasComponents = SUBJECTS[id].components[level] !== undefined;
        expect(hasComponents, `${id} ${level}`).toBe(hasBounds);
      }
    }
  });

  it('ibWeights sum to 100 for every subject/level', () => {
    for (const id of SUBJECT_IDS) {
      for (const level of levelsFor(id)) {
        const total = SUBJECTS[id].components[level]!.reduce((s, c) => s + c.ibWeight, 0);
        expect(total, `${id} ${level}`).toBeCloseTo(100, 6);
      }
    }
  });

  it('every subject/level has at least one exam component with positive marks', () => {
    for (const id of SUBJECT_IDS) {
      for (const level of levelsFor(id)) {
        const exams = examComponents(id, level);
        expect(exams.length, `${id} ${level}`).toBeGreaterThan(0);
        for (const c of exams) expect(c.maxMarks, `${id} ${level} ${c.name}`).toBeGreaterThan(0);
      }
    }
  });

  it('component names are unique within a subject/level', () => {
    for (const id of SUBJECT_IDS) {
      for (const level of levelsFor(id)) {
        const names = SUBJECTS[id].components[level]!.map((c) => c.name);
        expect(new Set(names).size, `${id} ${level}`).toBe(names.length);
      }
    }
  });

  it('matches verified Nov 2026 figures', () => {
    expect(examComponents('english-lal', 'HL').map((c) => [c.name, c.maxMarks, c.ibWeight])).toEqual([
      ['Paper 1: Guided textual analysis', 40, 35],
      ['Paper 2: Comparative essay', 25, 25],
    ]);
    expect(examComponents('global-politics', 'HL').map((c) => [c.maxMarks, c.ibWeight])).toEqual([
      [25, 20],
      [30, 30],
      [28, 30],
    ]);
    const physHL = examComponents('physics', 'HL');
    expect(physHL.map((c) => c.maxMarks)).toEqual([40, 20, 90]);
    expect(physHL[0].ibWeight + physHL[1].ibWeight).toBeCloseTo(36, 9);
    expect(physHL[2].ibWeight).toBe(44);
    expect(examComponents('sehs', 'HL').map((c) => c.maxMarks)).toEqual([40, 25, 80]);
    expect(examComponents('chinese-b', 'SL').map((c) => c.maxMarks)).toEqual([30, 25, 40]);
    expect(examComponents('music', 'HL')).toEqual([{ name: 'Trial mark', kind: 'exam', maxMarks: 100, ibWeight: 100 }]);
    expect(SUBJECTS.latin.components.HL!.find((c) => c.kind === 'coursework')?.name).toBe('Higher level composition');
  });
});

describe('GROUPS', () => {
  it('has six groups in order with the spec labels', () => {
    expect(GROUP_KEYS).toEqual(['g1', 'g2', 'g3', 'g4', 'g5', 'g6']);
    expect(GROUPS.map((g) => g.label)).toEqual([
      'Group 1: Studies in Language and Literature',
      'Group 2: Language Acquisition',
      'Group 3: Individuals and Societies',
      'Group 4: Sciences',
      'Group 5: Mathematics',
      'Group 6: The Arts or Elective',
    ]);
  });

  it('only references known subjects and has no duplicates within a group', () => {
    for (const g of GROUPS) {
      for (const id of g.subjects) expect(SUBJECT_IDS).toContain(id);
      expect(new Set(g.subjects).size, g.key).toBe(g.subjects.length);
    }
  });

  it('applies the RevisionDojo cross-group rules', () => {
    const by = Object.fromEntries(GROUPS.map((g) => [g.key, g.subjects]));
    expect(by.g2).toContain('english-lal');
    expect(by.g3).toContain('ess');
    expect(by.g4).toContain('ess');
    expect(by.g6).toEqual(expect.arrayContaining(['music', 'theatre', 'visual-arts', 'physics', 'history', 'latin', 'english-lit']));
    expect(by.g6).not.toContain('maths-aa');
    expect(by.g1).toEqual(['english-lal', 'english-lit']);
  });

  it('every subject appears in at least one group', () => {
    const all = new Set(GROUPS.flatMap((g) => g.subjects));
    for (const id of SUBJECT_IDS) expect(all.has(id), id).toBe(true);
  });
});
