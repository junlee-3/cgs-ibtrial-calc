import { describe, expect, it } from 'vitest';
import { initialState, reducer, type CalculatorState } from '@/lib/state';

describe('reducer', () => {
  it('setSubject stores the subject, clears marks, and auto-picks the only level', () => {
    const s1 = reducer(initialState, { type: 'setSubject', group: 'g2', subjectId: 'french-b' });
    expect(s1.groups.g2).toEqual({ subjectId: 'french-b', level: 'SL', marks: {} });
    const s2 = reducer(initialState, { type: 'setSubject', group: 'g4', subjectId: 'physics' });
    expect(s2.groups.g4).toEqual({ subjectId: 'physics', level: undefined, marks: {} });
  });

  it('setSubject with undefined clears the group', () => {
    const s1 = reducer(initialState, { type: 'setSubject', group: 'g4', subjectId: 'physics' });
    const s2 = reducer(s1, { type: 'setSubject', group: 'g4', subjectId: undefined });
    expect(s2.groups.g4).toEqual({ subjectId: undefined, level: undefined, marks: {} });
  });

  it('setLevel keeps the subject and clears marks', () => {
    let s = reducer(initialState, { type: 'setSubject', group: 'g4', subjectId: 'physics' });
    s = reducer(s, { type: 'setLevel', group: 'g4', level: 'HL' });
    s = reducer(s, { type: 'setMark', group: 'g4', component: 'Paper 2', value: 50 });
    s = reducer(s, { type: 'setLevel', group: 'g4', level: 'SL' });
    expect(s.groups.g4).toEqual({ subjectId: 'physics', level: 'SL', marks: {} });
  });

  it('setMark clamps to the component max and ignores unknown components', () => {
    let s = reducer(initialState, { type: 'setSubject', group: 'g4', subjectId: 'physics' });
    s = reducer(s, { type: 'setLevel', group: 'g4', level: 'HL' });
    s = reducer(s, { type: 'setMark', group: 'g4', component: 'Paper 2', value: 120 });
    s = reducer(s, { type: 'setMark', group: 'g4', component: 'Nope', value: 5 });
    expect(s.groups.g4.marks).toEqual({ 'Paper 2': 90 });
  });

  it('setTok and setEE clamp', () => {
    let s = reducer(initialState, { type: 'setTok', field: 'essay', value: 14 });
    s = reducer(s, { type: 'setTok', field: 'exhibition', value: -3 });
    s = reducer(s, { type: 'setEE', value: 40 });
    expect(s.tok).toEqual({ essay: 10, exhibition: 0 });
    expect(s.ee).toBe(34);
  });

  it('reset returns the initial state and hydrate replaces it', () => {
    const custom: CalculatorState = { ...initialState, ee: 20 };
    expect(reducer(custom, { type: 'reset' })).toEqual(initialState);
    expect(reducer(initialState, { type: 'hydrate', state: custom })).toEqual(custom);
  });
});
