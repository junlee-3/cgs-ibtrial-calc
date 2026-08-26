import type { GroupDef, GroupKey, SubjectId } from './types';

const G1: SubjectId[] = ['english-lal', 'english-lit'];
const G2: SubjectId[] = ['chinese-b', 'french-b', 'german-b', 'french-ab', 'indonesian-ab', 'spanish-ab', 'latin'];
const G3: SubjectId[] = ['business', 'economics', 'ess', 'geography', 'global-politics', 'history', 'philosophy', 'psychology'];
const G4: SubjectId[] = ['biology', 'chemistry', 'computer-science', 'ess', 'physics', 'sehs'];
const G5: SubjectId[] = ['maths-aa', 'maths-ai'];
const G6: SubjectId[] = ['music', 'theatre', 'visual-arts'];

const uniq = (ids: SubjectId[]): SubjectId[] => [...new Set(ids)];

/** Mirrors RevisionDojo's GROUP_MAP: G2 also offers Group 1 courses; G6 offers arts plus everything in Groups 1–4. */
export const GROUPS: GroupDef[] = [
  { key: 'g1', label: 'Group 1: Studies in Language and Literature', subjects: G1 },
  { key: 'g2', label: 'Group 2: Language Acquisition', subjects: uniq([...G2, ...G1]) },
  { key: 'g3', label: 'Group 3: Individuals and Societies', subjects: G3 },
  { key: 'g4', label: 'Group 4: Sciences', subjects: G4 },
  { key: 'g5', label: 'Group 5: Mathematics', subjects: G5 },
  { key: 'g6', label: 'Group 6: The Arts or Elective', subjects: uniq([...G6, ...G1, ...G2, ...G3, ...G4]) },
];

export const GROUP_KEYS: GroupKey[] = GROUPS.map((g) => g.key);
