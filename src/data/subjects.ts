import type { Component, Level, Subject, SubjectId } from './types';

const exam = (name: string, maxMarks: number, ibWeight: number): Component => ({ name, kind: 'exam', maxMarks, ibWeight });
const coursework = (name: string, maxMarks: number, ibWeight: number): Component => ({ name, kind: 'coursework', maxMarks, ibWeight });
const internal = (name: string, maxMarks: number, ibWeight: number): Component => ({ name, kind: 'internal', maxMarks, ibWeight });

/** Language B / ab initio (2020 guide): P1 writing 25%, P2 listening 25%, P2 reading 25%, IO 25%. */
const languageB = (): Component[] => [
  exam('Paper 1: Writing', 30, 25),
  exam('Paper 2: Listening', 25, 25),
  exam('Paper 2: Reading', 40, 25),
  internal('Individual oral', 30, 25),
];

/**
 * 2025/2026 science guides: Paper 1 (1A+1B) carries a single weight, split here pro-rata by marks —
 * identical to summing the raw marks. IA weight is 20 (Bio/Chem/Phys) or 24 (SEHS).
 */
const science = (p1a: number, p1b: number, p2: number, p2Weight: number, p1Weight: number, iaWeight: number): Component[] => {
  const p1 = p1a + p1b;
  return [
    exam('Paper 1A: Multiple choice', p1a, (p1Weight * p1a) / p1),
    exam('Paper 1B: Data-based', p1b, (p1Weight * p1b) / p1),
    exam('Paper 2', p2, p2Weight),
    internal('Scientific investigation', 24, iaWeight),
  ];
};

/** Arts courses have no written exam; the school enters one trial mark out of 100. */
const trialMark = (): Component[] => [exam('Trial mark', 100, 100)];

export const SUBJECTS: Record<SubjectId, Subject> = {
  'english-lal': {
    id: 'english-lal',
    name: 'English A: Language and Literature',
    short: 'English L&L',
    components: {
      SL: [exam('Paper 1: Guided textual analysis', 20, 35), exam('Paper 2: Comparative essay', 25, 35), internal('Individual oral', 40, 30)],
      HL: [exam('Paper 1: Guided textual analysis', 40, 35), exam('Paper 2: Comparative essay', 25, 25), coursework('HL essay', 20, 20), internal('Individual oral', 40, 20)],
    },
  },
  'english-lit': {
    id: 'english-lit',
    name: 'English A: Literature',
    short: 'English Lit',
    components: {
      SL: [exam('Paper 1: Guided literary analysis', 20, 35), exam('Paper 2: Comparative essay', 25, 35), internal('Individual oral', 40, 30)],
      HL: [exam('Paper 1: Guided literary analysis', 40, 35), exam('Paper 2: Comparative essay', 25, 25), coursework('HL essay', 20, 20), internal('Individual oral', 40, 20)],
    },
  },
  'chinese-b': { id: 'chinese-b', name: 'Chinese B', short: 'Chinese B', components: { SL: languageB(), HL: languageB() } },
  'french-ab': { id: 'french-ab', name: 'French ab initio', short: 'French ab initio', components: { SL: languageB() } },
  'french-b': { id: 'french-b', name: 'French B', short: 'French B', components: { SL: languageB() } },
  'german-b': { id: 'german-b', name: 'German B', short: 'German B', components: { SL: languageB() } },
  'indonesian-ab': { id: 'indonesian-ab', name: 'Indonesian ab initio', short: 'Indonesian ab initio', components: { SL: languageB() } },
  latin: {
    id: 'latin',
    name: 'Latin',
    short: 'Latin',
    components: {
      SL: [exam('Paper 1', 30, 35), exam('Paper 2', 32, 35), internal('Research dossier', 28, 30)],
      HL: [exam('Paper 1', 40, 30), exam('Paper 2', 32, 30), coursework('Higher level composition', 25, 20), internal('Research dossier', 28, 20)],
    },
  },
  'spanish-ab': { id: 'spanish-ab', name: 'Spanish ab initio', short: 'Spanish ab initio', components: { SL: languageB() } },
  business: {
    id: 'business',
    name: 'Business Management',
    short: 'Business',
    components: {
      SL: [exam('Paper 1', 30, 35), exam('Paper 2', 40, 35), internal('Business research project', 25, 30)],
      HL: [exam('Paper 1', 30, 25), exam('Paper 2', 50, 30), exam('Paper 3', 25, 25), internal('Business research project', 25, 20)],
    },
  },
  economics: {
    id: 'economics',
    name: 'Economics',
    short: 'Economics',
    components: {
      SL: [exam('Paper 1', 25, 30), exam('Paper 2', 40, 40), internal('Portfolio of commentaries', 45, 30)],
      HL: [exam('Paper 1', 25, 20), exam('Paper 2', 40, 30), exam('Paper 3', 60, 30), internal('Portfolio of commentaries', 45, 20)],
    },
  },
  geography: {
    id: 'geography',
    name: 'Geography',
    short: 'Geography',
    components: {
      SL: [exam('Paper 1', 40, 35), exam('Paper 2', 50, 40), internal('Fieldwork report', 25, 25)],
      HL: [exam('Paper 1', 60, 35), exam('Paper 2', 50, 25), exam('Paper 3', 28, 20), internal('Fieldwork report', 25, 20)],
    },
  },
  'global-politics': {
    id: 'global-politics',
    name: 'Global Politics',
    short: 'Global Politics',
    components: {
      SL: [exam('Paper 1', 25, 30), exam('Paper 2', 30, 40), internal('Engagement project', 24, 30)],
      HL: [exam('Paper 1', 25, 20), exam('Paper 2', 30, 30), exam('Paper 3', 28, 30), internal('Engagement project', 30, 20)],
    },
  },
  history: {
    id: 'history',
    name: 'History',
    short: 'History',
    components: {
      SL: [exam('Paper 1', 24, 30), exam('Paper 2', 30, 45), internal('Historical investigation', 25, 25)],
      HL: [exam('Paper 1', 24, 20), exam('Paper 2', 30, 25), exam('Paper 3', 45, 35), internal('Historical investigation', 25, 20)],
    },
  },
  philosophy: {
    id: 'philosophy',
    name: 'Philosophy',
    short: 'Philosophy',
    components: {
      SL: [exam('Paper 1', 50, 50), exam('Paper 2', 25, 25), internal('Philosophical analysis', 25, 25)],
      HL: [exam('Paper 1', 75, 40), exam('Paper 2', 25, 20), exam('Paper 3', 25, 20), internal('Philosophical analysis', 25, 20)],
    },
  },
  psychology: {
    id: 'psychology',
    name: 'Psychology',
    short: 'Psychology',
    components: {
      SL: [exam('Paper 1', 49, 50), exam('Paper 2', 22, 25), internal('Experimental study', 22, 25)],
      HL: [exam('Paper 1', 49, 40), exam('Paper 2', 44, 20), exam('Paper 3', 24, 20), internal('Experimental study', 22, 20)],
    },
  },
  ess: {
    id: 'ess',
    name: 'Environmental Systems and Societies',
    short: 'ESS',
    components: {
      SL: [exam('Paper 1', 35, 25), exam('Paper 2', 60, 50), internal('Individual investigation', 30, 25)],
      HL: [exam('Paper 1', 70, 30), exam('Paper 2', 80, 50), internal('Individual investigation', 30, 20)],
    },
  },
  biology: { id: 'biology', name: 'Biology', short: 'Biology', components: { SL: science(30, 25, 50, 44, 36, 20), HL: science(40, 35, 80, 44, 36, 20) } },
  chemistry: { id: 'chemistry', name: 'Chemistry', short: 'Chemistry', components: { SL: science(30, 25, 50, 44, 36, 20), HL: science(40, 35, 90, 44, 36, 20) } },
  'computer-science': {
    id: 'computer-science',
    name: 'Computer Science',
    short: 'Computer Science',
    components: {
      SL: [exam('Paper 1', 70, 45), exam('Paper 2', 45, 25), internal('Solution', 34, 30)],
      HL: [exam('Paper 1', 100, 40), exam('Paper 2', 65, 20), exam('Paper 3', 30, 20), internal('Solution', 34, 20)],
    },
  },
  physics: { id: 'physics', name: 'Physics', short: 'Physics', components: { SL: science(25, 20, 50, 44, 36, 20), HL: science(40, 20, 90, 44, 36, 20) } },
  sehs: { id: 'sehs', name: 'Sports, Exercise and Health Science', short: 'SEHS', components: { SL: science(30, 25, 50, 40, 36, 24), HL: science(40, 25, 80, 40, 36, 24) } },
  'maths-aa': {
    id: 'maths-aa',
    name: 'Mathematics: Analysis and Approaches',
    short: 'Maths AA',
    components: {
      SL: [exam('Paper 1 (no calculator)', 80, 40), exam('Paper 2', 80, 40), internal('Mathematical exploration', 20, 20)],
      HL: [exam('Paper 1 (no calculator)', 110, 30), exam('Paper 2', 110, 30), exam('Paper 3', 55, 20), internal('Mathematical exploration', 20, 20)],
    },
  },
  'maths-ai': {
    id: 'maths-ai',
    name: 'Mathematics: Applications and Interpretation',
    short: 'Maths AI',
    components: {
      SL: [exam('Paper 1', 80, 40), exam('Paper 2', 80, 40), internal('Mathematical exploration', 20, 20)],
      HL: [exam('Paper 1', 110, 30), exam('Paper 2', 110, 30), exam('Paper 3', 55, 20), internal('Mathematical exploration', 20, 20)],
    },
  },
  music: { id: 'music', name: 'Music', short: 'Music', components: { SL: trialMark(), HL: trialMark() } },
  theatre: { id: 'theatre', name: 'Theatre', short: 'Theatre', components: { SL: trialMark(), HL: trialMark() } },
  'visual-arts': { id: 'visual-arts', name: 'Visual Arts', short: 'Visual Arts', components: { SL: trialMark(), HL: trialMark() } },
};

export function getSubject(id: SubjectId): Subject {
  return SUBJECTS[id];
}

/** The components a student actually sits in a trial: timed exam papers only. */
export function examComponents(id: SubjectId, level: Level): Component[] {
  return (SUBJECTS[id].components[level] ?? []).filter((c) => c.kind === 'exam');
}
