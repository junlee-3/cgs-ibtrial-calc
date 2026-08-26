export const SUBJECT_IDS = [
  'english-lal',
  'english-lit',
  'chinese-b',
  'french-ab',
  'french-b',
  'german-b',
  'indonesian-ab',
  'latin',
  'spanish-ab',
  'business',
  'economics',
  'geography',
  'global-politics',
  'history',
  'philosophy',
  'psychology',
  'ess',
  'biology',
  'chemistry',
  'computer-science',
  'physics',
  'sehs',
  'maths-aa',
  'maths-ai',
  'music',
  'theatre',
  'visual-arts',
] as const;

export type SubjectId = (typeof SUBJECT_IDS)[number];
export type Level = 'SL' | 'HL';
export const LEVELS: Level[] = ['SL', 'HL'];

export type ComponentKind = 'exam' | 'coursework' | 'internal';

export interface Component {
  name: string;
  kind: ComponentKind;
  maxMarks: number;
  /** Percentage of the full IB grade (e.g. 36). */
  ibWeight: number;
}

export interface Subject {
  id: SubjectId;
  name: string;
  /** Short label for the scoresheet, e.g. "Maths AA". */
  short: string;
  components: Partial<Record<Level, Component[]>>;
}

/** Inclusive lower bound (whole percent) for grades 1..7. */
export type Bounds = readonly [number, number, number, number, number, number, number];

export type GroupKey = 'g1' | 'g2' | 'g3' | 'g4' | 'g5' | 'g6';

export interface GroupDef {
  key: GroupKey;
  label: string;
  subjects: SubjectId[];
}
