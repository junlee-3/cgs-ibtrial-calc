import { LEVELS, type Bounds, type Level, type SubjectId } from './types';

/**
 * CGS IB Diploma grade boundaries 2026 (3-year average), from
 * "IB_Grade_Boundaries 3 year average for 2026.pdf". Lower bound of each grade 1..7.
 * The PDF's duplicate "German SL" row is intentionally omitted.
 */
export const BOUNDARIES: Record<SubjectId, Partial<Record<Level, Bounds>>> = {
  'english-lal': { HL: [0, 15, 29, 43, 56, 68, 82], SL: [0, 13, 28, 41, 51, 68, 82] },
  'english-lit': { HL: [0, 14, 28, 41, 55, 67, 81], SL: [0, 12, 25, 39, 53, 66, 80] },
  'chinese-b': { HL: [0, 12, 24, 45, 58, 71, 84], SL: [0, 13, 27, 42, 56, 70, 83] },
  'french-ab': { SL: [0, 13, 28, 43, 55, 67, 79] },
  'french-b': { SL: [0, 12, 25, 38, 53, 68, 82] },
  'german-b': { SL: [0, 10, 21, 36, 51, 66, 81] },
  'indonesian-ab': { SL: [0, 10, 23, 36, 49, 63, 76] },
  latin: { HL: [0, 12, 26, 38, 57, 66, 79], SL: [0, 12, 25, 38, 51, 62, 75] },
  'spanish-ab': { SL: [0, 12, 25, 39, 53, 66, 81] },
  business: { HL: [0, 14, 27, 39, 50, 60, 71], SL: [0, 16, 31, 44, 55, 67, 79] },
  economics: { HL: [0, 13, 25, 37, 47, 64, 77], SL: [0, 15, 29, 42, 54, 67, 80] },
  geography: { HL: [0, 14, 29, 43, 54, 65, 76], SL: [0, 14, 29, 41, 53, 66, 78] },
  'global-politics': { HL: [0, 10, 22, 35, 47, 60, 72], SL: [0, 9, 21, 32, 43, 56, 66] },
  history: { HL: [0, 14, 28, 38, 51, 62, 74], SL: [0, 14, 29, 39, 52, 63, 77] },
  philosophy: { HL: [0, 11, 23, 39, 53, 66, 80], SL: [0, 11, 23, 35, 50, 64, 79] },
  psychology: { HL: [0, 9, 20, 35, 47, 60, 72], SL: [0, 10, 21, 36, 49, 59, 72] },
  ess: { HL: [0, 11, 22, 32, 43, 57, 69], SL: [0, 11, 23, 33, 44, 58, 69] },
  biology: { HL: [0, 14, 24, 36, 50, 64, 78], SL: [0, 14, 26, 40, 52, 65, 77] },
  chemistry: { HL: [0, 16, 27, 39, 52, 64, 76], SL: [0, 15, 28, 44, 54, 65, 75] },
  'computer-science': { HL: [0, 15, 30, 44, 53, 61, 70], SL: [0, 15, 32, 45, 55, 64, 73] },
  physics: { HL: [0, 14, 24, 37, 48, 58, 69], SL: [0, 14, 26, 39, 48, 59, 69] },
  sehs: { HL: [0, 14, 23, 36, 48, 61, 74], SL: [0, 14, 25, 39, 53, 67, 80] },
  'maths-aa': { HL: [0, 13, 25, 35, 49, 63, 78], SL: [0, 13, 25, 37, 52, 67, 80] },
  'maths-ai': { HL: [0, 14, 27, 38, 51, 64, 77], SL: [0, 13, 25, 38, 53, 67, 80] },
  music: { HL: [0, 11, 22, 39, 53, 67, 81], SL: [0, 11, 21, 38, 52, 65, 78] },
  theatre: { HL: [0, 10, 21, 35, 51, 67, 83], SL: [0, 10, 20, 34, 51, 67, 83] },
  'visual-arts': { HL: [0, 10, 20, 39, 53, 66, 81], SL: [0, 11, 22, 34, 50, 65, 80] },
};

/** Levels the school offers for a subject, SL first. */
export function levelsFor(id: SubjectId): Level[] {
  return LEVELS.filter((level) => BOUNDARIES[id][level] !== undefined);
}
