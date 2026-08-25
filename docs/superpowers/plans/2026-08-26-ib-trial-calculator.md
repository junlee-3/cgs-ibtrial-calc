# CGS IB Trial Grade Calculator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A static Next.js site where CGS IB students enter trial-exam paper marks and see per-subject IB grades (from the school's 2026 boundaries), TOK/EE core points and a total out of 45 — a functional clone of revisiondojo.com/grade-calculator.

**Architecture:** Pure data (`src/data`) + pure scoring functions (`src/lib`) covered by Vitest, composed by one client component (`Calculator`) that owns a `useReducer` state mirrored to localStorage. UI is shadcn/ui primitives inside six group cards, a core-points card and a scoresheet card. No server code.

**Tech Stack:** Next.js 16 (App Router, `src/` dir, Turbopack), React 19, TypeScript, Tailwind CSS v4, shadcn/ui (select, slider, input, card, badge, table, button), Vitest 4, pnpm, Vercel (auto-deploy from GitHub `main`).

**Spec:** `docs/superpowers/specs/2026-08-26-ib-trial-calculator-design.md`

## Global Constraints

- Package manager is **pnpm**; commit `pnpm-lock.yaml`.
- Only components with `kind: 'exam'` are shown or scored; exam `ibWeight`s are rescaled to sum to 1 (spec §5.2).
- Percent is rounded to the nearest whole number **before** boundary lookup (spec §5.4).
- TOK letters from `/30` lower bounds `[0,4,10,16,22]`; EE letters from `/34` lower bounds `[0,6,13,20,26]`; core matrix as in spec §5.7.
- UI copy is RevisionDojo's verbatim where the spec quotes it (§5.9, §6): "Select subject", "Select level", "Total Weighted Score:", "Predicted IB Grade:", "Weight:", "Pick all six subjects to get a prediction.", etc.
- Group dropdown map exactly as spec §4.3 (G2 also offers English A courses; G6 offers arts + all G1–G4).
- Dark mode follows `prefers-color-scheme` (no toggle). Accent `#5B4FE9` light / `#8B82FF` dark. Fonts Manrope (display) + Inter (body), tabular numerals.
- localStorage key `cgs-ib-trial-v1`.
- Commit **and push** to `origin main` at the end of every task (the user connects Vercel to GitHub; every push deploys).
- Commit messages end with:
  ```
  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01Dfn27dVBEtGX22FpfCxNXH
  ```

## File structure

| File | Responsibility |
|---|---|
| `src/data/types.ts` | Shared types: `SubjectId`, `Level`, `Component`, `Subject`, `Bounds`, `GroupKey`, `GroupDef` |
| `src/data/boundaries.ts` | The 49 school boundary rows (lower bounds g1–g7) |
| `src/data/subjects.ts` | Subject catalogue with verified Nov-2026 components; `levelsFor()` |
| `src/data/groups.ts` | Group → subject dropdown map |
| `src/lib/score.ts` | Subject scoring: clamp, reweight, weighted percent, grade lookup |
| `src/lib/core.ts` | TOK/EE letters, core-points matrix, diploma checks, total, tagline |
| `src/lib/state.ts` | `CalculatorState`, `initialState`, `reducer` |
| `src/lib/storage.ts` | localStorage load/save |
| `src/lib/__tests__/*.test.ts` | Vitest unit tests |
| `src/components/StepHeading.tsx` | Numbered step title |
| `src/components/ScoreDial.tsx` | SVG 0–7 ring |
| `src/components/PaperRow.tsx` | One mark input row (label, weight, slider, number box) |
| `src/components/GroupCard.tsx` | One IB group: selects + result + paper rows |
| `src/components/CoreSection.tsx` | TOK/EE inputs, letters, matrix, core points |
| `src/components/Scoresheet.tsx` | Results table, /45, diploma status |
| `src/components/Calculator.tsx` | Client component owning state; composes the above |
| `src/app/layout.tsx`, `page.tsx`, `globals.css` | Shell, fonts, theme, hero |
| `src/app/boundaries/page.tsx` | Boundaries table page |

---

### Task 1: Scaffold Next.js + shadcn + Vitest, link Vercel

**Files:**
- Create: everything `create-next-app` generates (in `src/`), `components.json`, `src/components/ui/*`, `vitest.config.ts`, `src/lib/__tests__/smoke.test.ts`
- Modify: `.gitignore` (merge), `package.json` (scripts), `src/app/globals.css` (replace)

**Interfaces:**
- Produces: import alias `@/*` → `src/*`; shadcn components at `@/components/ui/{button,card,input,select,slider,badge,table}`; `pnpm test` runs Vitest; `pnpm build` builds.

- [ ] **Step 1: Scaffold into a temp dir and merge (the repo root is not empty)**

```bash
cd /Users/junlee/Documents/programming/cgs-ibtrial-calc
rm -rf /private/tmp/claude-501/cgs-scaffold
npx --yes create-next-app@latest /private/tmp/claude-501/cgs-scaffold \
  --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --yes --disable-git --skip-install
# merge, keeping our .gitignore and appending theirs
cp .gitignore /private/tmp/claude-501/ours.gitignore
rsync -a --exclude .gitignore /private/tmp/claude-501/cgs-scaffold/ ./
cat /private/tmp/claude-501/cgs-scaffold/.gitignore >> .gitignore
pnpm install
```

Expected: `src/app/{layout.tsx,page.tsx,globals.css}`, `package.json` with `next`, `react`, `tailwindcss` deps; `pnpm install` completes.

- [ ] **Step 2: Initialise shadcn and add the components**

```bash
pnpm dlx shadcn@latest init -d -y
pnpm dlx shadcn@latest add -y button card input select slider badge table
ls src/components/ui
```

Expected: `components.json` at root; `src/components/ui/{button,card,input,select,slider,badge,table}.tsx`; `src/lib/utils.ts` (`cn`). If init asks about the colour, choose Neutral.

- [ ] **Step 3: Replace `src/app/globals.css` with the project theme (system dark mode, accent, fonts)**

```css
@import "tailwindcss";
@import "tw-animate-css";

@theme inline {
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-manrope), var(--font-inter), ui-sans-serif, sans-serif;
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --radius: 0.75rem;
  --background: #ffffff;
  --foreground: #0a0a0a;
  --card: #ffffff;
  --card-foreground: #0a0a0a;
  --popover: #ffffff;
  --popover-foreground: #0a0a0a;
  --primary: #5b4fe9;
  --primary-foreground: #ffffff;
  --secondary: #f5f5f5;
  --secondary-foreground: #171717;
  --muted: #f5f5f5;
  --muted-foreground: #737373;
  --accent: #efedff;
  --accent-foreground: #171717;
  --destructive: #dc2626;
  --border: #e5e5e5;
  --input: #e5e5e5;
  --ring: #5b4fe9;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0d0d0d;
    --foreground: #fafafa;
    --card: #141414;
    --card-foreground: #fafafa;
    --popover: #171717;
    --popover-foreground: #fafafa;
    --primary: #8b82ff;
    --primary-foreground: #0a0a0a;
    --secondary: #1a1a1a;
    --secondary-foreground: #fafafa;
    --muted: #1f1f1f;
    --muted-foreground: #a3a3a3;
    --accent: #26224a;
    --accent-foreground: #fafafa;
    --destructive: #ef4444;
    --border: #262626;
    --input: #262626;
    --ring: #8b82ff;
  }
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
    font-variant-numeric: tabular-nums;
  }
}
```

Note: no `@custom-variant dark` line — Tailwind's default `dark:` variant then follows `prefers-color-scheme`, matching the media query above.

- [ ] **Step 4: Add Vitest**

```bash
pnpm add -D vitest
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
```

Add to `package.json` `"scripts"`: `"test": "vitest run"` (keep `dev`, `build`, `start`, `lint`).

Create `src/lib/__tests__/smoke.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils';

describe('toolchain', () => {
  it('resolves the @ alias', () => {
    expect(cn('a', 'b')).toBe('a b');
  });
});
```

- [ ] **Step 5: Run tests and build**

Run: `pnpm test && pnpm build`
Expected: `1 passed`; build succeeds with route `/` static.

- [ ] **Step 6: Create the Vercel project from the GitHub repo**

```bash
vercel link --yes --scope junlee-3 --project cgs-ibtrial-calc
vercel git connect https://github.com/junlee-3/cgs-ibtrial-calc
```

Expected: `.vercel/project.json` created (gitignored); "Connected GitHub repository junlee-3/cgs-ibtrial-calc". If `vercel git connect` fails because the GitHub app is not installed, use the Vercel MCP tool `mcp__plugin_vercel_vercel__create_git_project` (load via ToolSearch) with `teamId: team_iVCyTV4v49kaDHpdcEY7xVTg`, repo `junlee-3/cgs-ibtrial-calc`, name `cgs-ibtrial-calc`, framework `nextjs`. Report which path worked.

- [ ] **Step 7: Commit and push**

```bash
git add -A
git commit -m "Scaffold Next.js app with shadcn/ui, Tailwind theme and Vitest

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Dfn27dVBEtGX22FpfCxNXH"
git push origin main
```

---

### Task 2: Types and grade boundaries data

**Files:**
- Create: `src/data/types.ts`, `src/data/boundaries.ts`
- Test: `src/lib/__tests__/boundaries.test.ts`

**Interfaces:**
- Produces: `SUBJECT_IDS`, `SubjectId`, `Level`, `ComponentKind`, `Component`, `Subject`, `Bounds`, `GroupKey`, `GroupDef` from `@/data/types`; `BOUNDARIES: Record<SubjectId, Partial<Record<Level, Bounds>>>` and `levelsFor(id): Level[]` from `@/data/boundaries`.

- [ ] **Step 1: Write the failing test**

`src/lib/__tests__/boundaries.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/lib/__tests__/boundaries.test.ts`
Expected: FAIL — cannot resolve `@/data/boundaries`.

- [ ] **Step 3: Write `src/data/types.ts`**

```ts
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
```

- [ ] **Step 4: Write `src/data/boundaries.ts`**

```ts
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
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm vitest run src/lib/__tests__/boundaries.test.ts`
Expected: 4 passed.

- [ ] **Step 6: Commit and push**

```bash
git add src/data/types.ts src/data/boundaries.ts src/lib/__tests__/boundaries.test.ts
git commit -m "Add subject types and CGS 2026 grade boundaries data

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Dfn27dVBEtGX22FpfCxNXH"
git push origin main
```

---

### Task 3: Subject catalogue and group map

**Files:**
- Create: `src/data/subjects.ts`, `src/data/groups.ts`
- Test: `src/lib/__tests__/subjects.test.ts`

**Interfaces:**
- Consumes: `BOUNDARIES`, `levelsFor` (Task 2); types (Task 2).
- Produces: `SUBJECTS: Record<SubjectId, Subject>`, `getSubject(id)`, `examComponents(id, level): Component[]` from `@/data/subjects`; `GROUPS: GroupDef[]`, `GROUP_KEYS: GroupKey[]` from `@/data/groups`.

- [ ] **Step 1: Write the failing test**

`src/lib/__tests__/subjects.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/lib/__tests__/subjects.test.ts`
Expected: FAIL — cannot resolve `@/data/subjects`.

- [ ] **Step 3: Write `src/data/subjects.ts`**

```ts
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
```

- [ ] **Step 4: Write `src/data/groups.ts`**

```ts
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
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm vitest run src/lib/__tests__/subjects.test.ts`
Expected: 9 passed.

- [ ] **Step 6: Commit and push**

```bash
git add src/data/subjects.ts src/data/groups.ts src/lib/__tests__/subjects.test.ts
git commit -m "Add verified Nov 2026 subject components and group dropdown map

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Dfn27dVBEtGX22FpfCxNXH"
git push origin main
```

---

### Task 4: Subject scoring functions

**Files:**
- Create: `src/lib/score.ts`
- Test: `src/lib/__tests__/score.test.ts`

**Interfaces:**
- Consumes: `examComponents` (Task 3), `BOUNDARIES` (Task 2).
- Produces from `@/lib/score`: `clampMark(value, max): number`, `trialWeights(components): number[]` (fractions summing to 1), `weightedPercent(components, marks): number`, `gradeFor(percent, bounds): number` (1–7), `scoreSubject(id, level, marks): SubjectScore` where `SubjectScore = { percent: number; grade: number; rows: { component: Component; weight: number }[] }`, and `Marks = Record<string, number>` keyed by component name.

- [ ] **Step 1: Write the failing test**

`src/lib/__tests__/score.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { examComponents } from '@/data/subjects';
import { clampMark, gradeFor, scoreSubject, trialWeights, weightedPercent } from '@/lib/score';

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
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/lib/__tests__/score.test.ts`
Expected: FAIL — cannot resolve `@/lib/score`.

- [ ] **Step 3: Write `src/lib/score.ts`**

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/lib/__tests__/score.test.ts`
Expected: 12 passed.

- [ ] **Step 5: Commit and push**

```bash
git add src/lib/score.ts src/lib/__tests__/score.test.ts
git commit -m "Add exam-only subject scoring with reweighting and boundary lookup

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Dfn27dVBEtGX22FpfCxNXH"
git push origin main
```

---

### Task 5: TOK/EE, core points, diploma checks

**Files:**
- Create: `src/lib/core.ts`
- Test: `src/lib/__tests__/core.test.ts`

**Interfaces:**
- Consumes: `clampMark` (Task 4); `Level`, `SubjectId` (Task 2).
- Produces from `@/lib/core`: `LETTERS = ['E','D','C','B','A']`, `Letter`, `TOK_MAX = 30`, `EE_MAX = 34`, `TOK_BOUNDS`, `EE_BOUNDS`, `letterIndex(score, bounds): number` (0=E … 4=A), `tokScore(essay, exhibition): number`, `corePoints(eeIdx, tokIdx): number | 'fail'`, `CORE_MATRIX`, `SubjectResult = { subjectId; level; grade }`, `totalPoints(subjects, core): number`, `diplomaFailures(subjects, core): string[]`, `tagline(subjectCount, failures, total): string`, `statusLabel(subjectCount, failures): string`.

- [ ] **Step 1: Write the failing test**

`src/lib/__tests__/core.test.ts`:

```ts
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
    expect(diplomaFailures(dup, 2)).toContain('Your subject selection does not meet IB Diploma requirements.');
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/lib/__tests__/core.test.ts`
Expected: FAIL — cannot resolve `@/lib/core`.

- [ ] **Step 3: Write `src/lib/core.ts`**

```ts
import type { Level, SubjectId } from '@/data/types';
import { clampMark } from '@/lib/score';

export const LETTERS = ['E', 'D', 'C', 'B', 'A'] as const;
export type Letter = (typeof LETTERS)[number];

export const TOK_MAX = 30;
export const EE_MAX = 34;
/** Lower bounds for E, D, C, B, A on the TOK /30 and EE /34 scales. */
export const TOK_BOUNDS = [0, 4, 10, 16, 22] as const;
export const EE_BOUNDS = [0, 6, 13, 20, 26] as const;

/** 0 = E … 4 = A. */
export function letterIndex(score: number, bounds: readonly number[]): number {
  return bounds.reduce((idx, lower, i) => (score >= lower ? i : idx), 0);
}

/** TOK essay /10 counts twice, exhibition /10 once → /30. */
export function tokScore(essay: number, exhibition: number): number {
  return 2 * clampMark(essay, 10) + clampMark(exhibition, 10);
}

/** CORE_MATRIX[eeIdx][tokIdx]; null = failing condition. Index order E, D, C, B, A. */
export const CORE_MATRIX: readonly (readonly (number | null)[])[] = [
  [null, null, null, null, null],
  [null, 0, 0, 1, 2],
  [null, 0, 1, 2, 2],
  [null, 1, 2, 2, 3],
  [null, 2, 2, 3, 3],
];

export function corePoints(eeIdx: number, tokIdx: number): number | 'fail' {
  const v = CORE_MATRIX[eeIdx]?.[tokIdx];
  return v === null || v === undefined ? 'fail' : v;
}

export interface SubjectResult {
  subjectId: SubjectId;
  level: Level;
  grade: number;
}

export function totalPoints(subjects: SubjectResult[], core: number | 'fail'): number {
  return subjects.reduce((sum, s) => sum + s.grade, 0) + (core === 'fail' ? 0 : core);
}

const sumTop = (grades: number[], n: number) =>
  [...grades].sort((a, b) => b - a).slice(0, n).reduce((a, b) => a + b, 0);

/** Failed IB Diploma conditions, in RevisionDojo's wording. Empty array = diploma awarded. */
export function diplomaFailures(subjects: SubjectResult[], core: number | 'fail'): string[] {
  if (subjects.length !== 6) return ['Select exactly 6 subjects'];
  const failures: string[] = [];
  if (new Set(subjects.map((s) => s.subjectId)).size !== subjects.length) {
    failures.push('Your subject selection does not meet IB Diploma requirements.');
  }
  const hl = subjects.filter((s) => s.level === 'HL').map((s) => s.grade);
  const sl = subjects.filter((s) => s.level === 'SL').map((s) => s.grade);
  const grades = subjects.map((s) => s.grade);
  if (hl.length < 3) failures.push('You must take at least 3 HL subjects.');
  if (core === 'fail') failures.push('TOK or EE grade is E (automatic fail).');
  if (totalPoints(subjects, core) < 24) failures.push('Less than 24 total points.');
  if (grades.includes(1)) failures.push('Cannot have any grade 1.');
  if (grades.filter((g) => g === 2).length > 2) failures.push('More than two grade 2s.');
  if (grades.filter((g) => g === 3).length > 3) failures.push('More than three grade 3s.');
  if (hl.length >= 3 && sumTop(hl, 3) < 12) {
    failures.push(hl.length === 3 ? 'Less than 12 HL points.' : 'Less than 12 points across the three highest HLs.');
  }
  if (sl.length === 3 && sumTop(sl, 3) < 9) failures.push('Less than 9 SL points.');
  if (sl.length === 2 && sumTop(sl, 2) < 5) failures.push('Less than 5 SL points.');
  return failures;
}

export function statusLabel(subjectCount: number, failures: string[]): string {
  if (subjectCount < 6) return `Select ${6 - subjectCount} more subject${6 - subjectCount === 1 ? '' : 's'}`;
  return failures.length === 0 ? 'Diploma awarded' : 'Diploma not awarded';
}

export function tagline(subjectCount: number, failures: string[], total: number): string {
  if (subjectCount < 6) return 'Pick all six subjects to get a prediction.';
  if (failures.length > 0) return 'Diploma at risk – see what to fix below.';
  if (total >= 40) return 'Top of the cohort. Keep it up.';
  if (total >= 35) return "Strong score – you're doing well.";
  return 'On track for the diploma.';
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/lib/__tests__/core.test.ts`
Expected: 10 passed.

- [ ] **Step 5: Commit and push**

```bash
git add src/lib/core.ts src/lib/__tests__/core.test.ts
git commit -m "Add TOK/EE letters, core points matrix and diploma checks

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Dfn27dVBEtGX22FpfCxNXH"
git push origin main
```

---

### Task 6: Calculator state reducer and localStorage

**Files:**
- Create: `src/lib/state.ts`, `src/lib/storage.ts`
- Test: `src/lib/__tests__/state.test.ts`

**Interfaces:**
- Consumes: `levelsFor` (Task 2), `GROUP_KEYS` (Task 3), `clampMark` (Task 4), `examComponents` (Task 3).
- Produces from `@/lib/state`: `GroupState = { subjectId?: SubjectId; level?: Level; marks: Marks }`, `CalculatorState = { groups: Record<GroupKey, GroupState>; tok: { essay: number; exhibition: number }; ee: number }`, `initialState`, `Action` union, `reducer(state, action)`. From `@/lib/storage`: `STORAGE_KEY`, `loadState(): CalculatorState | null`, `saveState(state): void`.

- [ ] **Step 1: Write the failing test**

`src/lib/__tests__/state.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/lib/__tests__/state.test.ts`
Expected: FAIL — cannot resolve `@/lib/state`.

- [ ] **Step 3: Write `src/lib/state.ts`**

```ts
import { levelsFor } from '@/data/boundaries';
import { GROUP_KEYS } from '@/data/groups';
import { examComponents } from '@/data/subjects';
import type { GroupKey, Level, SubjectId } from '@/data/types';
import { EE_MAX } from '@/lib/core';
import { clampMark, type Marks } from '@/lib/score';

export interface GroupState {
  subjectId?: SubjectId;
  level?: Level;
  marks: Marks;
}

export interface CalculatorState {
  groups: Record<GroupKey, GroupState>;
  tok: { essay: number; exhibition: number };
  ee: number;
}

export const initialState: CalculatorState = {
  groups: Object.fromEntries(GROUP_KEYS.map((k) => [k, { marks: {} }])) as Record<GroupKey, GroupState>,
  tok: { essay: 0, exhibition: 0 },
  ee: 0,
};

export type Action =
  | { type: 'setSubject'; group: GroupKey; subjectId: SubjectId | undefined }
  | { type: 'setLevel'; group: GroupKey; level: Level }
  | { type: 'setMark'; group: GroupKey; component: string; value: number }
  | { type: 'setTok'; field: 'essay' | 'exhibition'; value: number }
  | { type: 'setEE'; value: number }
  | { type: 'reset' }
  | { type: 'hydrate'; state: CalculatorState };

export function reducer(state: CalculatorState, action: Action): CalculatorState {
  switch (action.type) {
    case 'setSubject': {
      const levels = action.subjectId ? levelsFor(action.subjectId) : [];
      const level = levels.length === 1 ? levels[0] : undefined;
      return { ...state, groups: { ...state.groups, [action.group]: { subjectId: action.subjectId, level, marks: {} } } };
    }
    case 'setLevel': {
      const g = state.groups[action.group];
      return { ...state, groups: { ...state.groups, [action.group]: { subjectId: g.subjectId, level: action.level, marks: {} } } };
    }
    case 'setMark': {
      const g = state.groups[action.group];
      if (!g.subjectId || !g.level) return state;
      const component = examComponents(g.subjectId, g.level).find((c) => c.name === action.component);
      if (!component) return state;
      return {
        ...state,
        groups: {
          ...state.groups,
          [action.group]: { ...g, marks: { ...g.marks, [action.component]: clampMark(action.value, component.maxMarks) } },
        },
      };
    }
    case 'setTok':
      return { ...state, tok: { ...state.tok, [action.field]: clampMark(action.value, 10) } };
    case 'setEE':
      return { ...state, ee: clampMark(action.value, EE_MAX) };
    case 'reset':
      return initialState;
    case 'hydrate':
      return action.state;
  }
}
```

- [ ] **Step 4: Write `src/lib/storage.ts`**

```ts
import { GROUP_KEYS } from '@/data/groups';
import type { CalculatorState } from '@/lib/state';

export const STORAGE_KEY = 'cgs-ib-trial-v1';

function isState(value: unknown): value is CalculatorState {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  const groups = v.groups as Record<string, unknown> | undefined;
  if (typeof groups !== 'object' || groups === null) return false;
  if (!GROUP_KEYS.every((k) => typeof groups[k] === 'object' && groups[k] !== null)) return false;
  const tok = v.tok as Record<string, unknown> | undefined;
  return typeof tok === 'object' && tok !== null && typeof tok.essay === 'number' && typeof tok.exhibition === 'number' && typeof v.ee === 'number';
}

export function loadState(): CalculatorState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveState(state: CalculatorState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable (private mode, quota) — silently ignore
  }
}
```

- [ ] **Step 5: Run all tests to verify they pass**

Run: `pnpm test`
Expected: all suites pass (boundaries 4, subjects 9, score 12, core 10, state 6, smoke 1).

- [ ] **Step 6: Commit and push**

```bash
git add src/lib/state.ts src/lib/storage.ts src/lib/__tests__/state.test.ts
git commit -m "Add calculator state reducer and localStorage persistence

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Dfn27dVBEtGX22FpfCxNXH"
git push origin main
```

---

### Task 7: UI primitives — StepHeading, ScoreDial, PaperRow

**Files:**
- Create: `src/components/StepHeading.tsx`, `src/components/ScoreDial.tsx`, `src/components/PaperRow.tsx`

**Interfaces:**
- Consumes: shadcn `Slider`, `Input` (Task 1); `clampMark` (Task 4).
- Produces: `StepHeading({ number: number; label: string })`, `ScoreDial({ grade: number; size?: number })`, `PaperRow({ label: string; weight: number /* fraction 0–1 */; value: number; max: number; onChange(value: number): void })`.

- [ ] **Step 1: Write `src/components/StepHeading.tsx`**

```tsx
export function StepHeading({ number, label }: { number: number; label: string }) {
  return (
    <div className="mt-12 mb-4 flex items-center gap-3">
      <span className="flex size-8 items-center justify-center rounded-full bg-primary font-display text-base font-bold text-primary-foreground">
        {number}
      </span>
      <h3 className="text-xl font-medium">{label}</h3>
    </div>
  );
}
```

- [ ] **Step 2: Write `src/components/ScoreDial.tsx`**

```tsx
export function ScoreDial({ grade, size = 80 }: { grade: number; size?: number }) {
  const stroke = 7;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const fraction = Math.max(0, Math.min(1, grade / 7));
  const centre = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Predicted grade ${grade} out of 7`} className="shrink-0">
      <circle cx={centre} cy={centre} r={r} fill="none" strokeWidth={stroke} className="stroke-muted" />
      <circle
        cx={centre}
        cy={centre}
        r={r}
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - fraction)}
        transform={`rotate(-90 ${centre} ${centre})`}
        className="stroke-primary transition-[stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none"
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="fill-foreground font-display text-2xl font-bold">
        {grade}
      </text>
    </svg>
  );
}
```

- [ ] **Step 3: Write `src/components/PaperRow.tsx`**

```tsx
'use client';

import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { clampMark } from '@/lib/score';

interface PaperRowProps {
  label: string;
  /** Fraction of the subject's trial mark, 0–1. */
  weight: number;
  value: number;
  max: number;
  onChange: (value: number) => void;
}

export function PaperRow({ label, weight, value, max, onChange }: PaperRowProps) {
  const inputId = `mark-${label.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <div className="rounded-xl bg-muted p-4">
      <div className="flex w-full items-center justify-between gap-2 text-base font-medium">
        <label htmlFor={inputId}>{label}</label>
        <span className="text-sm text-muted-foreground">Weight: {Math.round(weight * 100)}%</span>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <Slider min={0} max={max} step={1} value={[value]} onValueChange={([v]) => onChange(clampMark(v, max))} aria-label={`${label} mark`} />
        <div className="flex shrink-0 items-center gap-1">
          <Input
            id={inputId}
            type="number"
            inputMode="numeric"
            min={0}
            max={max}
            value={value}
            onChange={(e) => onChange(clampMark(Number(e.target.value), max))}
            className="w-16 border-none bg-transparent text-right font-medium shadow-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span className="text-sm text-muted-foreground">/ {max}</span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Type-check and build**

Run: `pnpm exec tsc --noEmit && pnpm build`
Expected: no type errors; build succeeds (components are not yet rendered — that is fine).

- [ ] **Step 5: Commit and push**

```bash
git add src/components/StepHeading.tsx src/components/ScoreDial.tsx src/components/PaperRow.tsx
git commit -m "Add StepHeading, ScoreDial and PaperRow components

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Dfn27dVBEtGX22FpfCxNXH"
git push origin main
```

---

### Task 8: GroupCard

**Files:**
- Create: `src/components/GroupCard.tsx`

**Interfaces:**
- Consumes: `GroupDef` (Task 2), `SUBJECTS`, `levelsFor` (Tasks 2–3), `scoreSubject` (Task 4), `GroupState`, `Action` (Task 6), `ScoreDial`, `PaperRow` (Task 7), shadcn `Card`, `Select`.
- Produces: `GroupCard({ group: GroupDef; state: GroupState; duplicate: boolean; dispatch: (a: Action) => void })`.

- [ ] **Step 1: Write `src/components/GroupCard.tsx`**

```tsx
'use client';

import { PaperRow } from '@/components/PaperRow';
import { ScoreDial } from '@/components/ScoreDial';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { levelsFor } from '@/data/boundaries';
import { SUBJECTS } from '@/data/subjects';
import type { GroupDef, Level, SubjectId } from '@/data/types';
import { scoreSubject } from '@/lib/score';
import type { Action, GroupState } from '@/lib/state';

interface GroupCardProps {
  group: GroupDef;
  state: GroupState;
  duplicate: boolean;
  dispatch: (action: Action) => void;
}

export function GroupCard({ group, state, duplicate, dispatch }: GroupCardProps) {
  const options = [...group.subjects].sort((a, b) => SUBJECTS[a].name.localeCompare(SUBJECTS[b].name));
  const levels = state.subjectId ? levelsFor(state.subjectId) : [];
  const ready = state.subjectId !== undefined && state.level !== undefined;
  const result = ready ? scoreSubject(state.subjectId as SubjectId, state.level as Level, state.marks) : null;

  return (
    <Card className="gap-4 p-6">
      <h2 className="font-display text-lg font-bold">{group.label}</h2>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Select value={state.subjectId ?? ''} onValueChange={(v) => dispatch({ type: 'setSubject', group: group.key, subjectId: v as SubjectId })}>
          <SelectTrigger className="w-full rounded-2xl bg-muted sm:min-w-[260px]" aria-label={`${group.label} subject`}>
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            {options.map((id) => (
              <SelectItem key={id} value={id}>
                {SUBJECTS[id].name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state.subjectId && levels.length > 1 && (
          <Select value={state.level ?? ''} onValueChange={(v) => dispatch({ type: 'setLevel', group: group.key, level: v as Level })}>
            <SelectTrigger className="w-full rounded-2xl bg-muted sm:w-[140px]" aria-label={`${group.label} level`}>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {state.subjectId && levels.length === 1 && (
          <span className="inline-flex items-center rounded-2xl bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">{levels[0]} only</span>
        )}
      </div>
      {duplicate && <p className="text-sm text-destructive">This subject is already selected in another group.</p>}
      {result && state.subjectId && (
        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <div className="flex items-center gap-4 py-2">
            <ScoreDial grade={result.grade} />
            <div>
              <p>
                <span className="font-medium">Total Weighted Score:</span> {Math.round(result.percent)}/100
              </p>
              <p>
                <span className="font-medium">Predicted IB Grade:</span> {result.grade}/7
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {result.rows.map(({ component, weight }) => (
              <PaperRow
                key={component.name}
                label={component.name}
                weight={weight}
                max={component.maxMarks}
                value={state.marks[component.name] ?? 0}
                onChange={(value) => dispatch({ type: 'setMark', group: group.key, component: component.name, value })}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit and push**

```bash
git add src/components/GroupCard.tsx
git commit -m "Add GroupCard with subject/level selects, dial and paper rows

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Dfn27dVBEtGX22FpfCxNXH"
git push origin main
```

---

### Task 9: CoreSection (TOK/EE + matrix)

**Files:**
- Create: `src/components/CoreSection.tsx`

**Interfaces:**
- Consumes: `LETTERS`, `TOK_BOUNDS`, `EE_BOUNDS`, `TOK_MAX`, `EE_MAX`, `letterIndex`, `tokScore`, `corePoints`, `CORE_MATRIX` (Task 5); `PaperRow` (Task 7); `Action` (Task 6); shadcn `Card`.
- Produces: `CoreSection({ tok: { essay: number; exhibition: number }; ee: number; dispatch: (a: Action) => void })`.

- [ ] **Step 1: Write `src/components/CoreSection.tsx`**

```tsx
'use client';

import { PaperRow } from '@/components/PaperRow';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CORE_MATRIX, corePoints, EE_BOUNDS, EE_MAX, LETTERS, letterIndex, TOK_BOUNDS, TOK_MAX, tokScore } from '@/lib/core';
import type { Action } from '@/lib/state';

interface CoreSectionProps {
  tok: { essay: number; exhibition: number };
  ee: number;
  dispatch: (action: Action) => void;
}

function ScoreBox({ score, letter }: { score: string; letter: string }) {
  return (
    <div className="my-2 flex items-center justify-between rounded-xl bg-muted p-4">
      <div>
        <p className="text-sm text-muted-foreground">Score</p>
        <p className="text-lg font-semibold">{score}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-muted-foreground">Awarded Grade</p>
        <p className="font-display text-2xl font-bold">{letter}</p>
      </div>
    </div>
  );
}

const cellClass = (v: number | null) =>
  v === null
    ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
    : v === 3
      ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-500/30 dark:text-emerald-200'
      : v === 2
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
        : v === 1
          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300'
          : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300';

export function CoreSection({ tok, ee, dispatch }: CoreSectionProps) {
  const tokTotal = tokScore(tok.essay, tok.exhibition);
  const tokIdx = letterIndex(tokTotal, TOK_BOUNDS);
  const eeIdx = letterIndex(ee, EE_BOUNDS);
  const points = corePoints(eeIdx, tokIdx);
  const display = [...LETTERS].reverse(); // A, B, C, D, E

  return (
    <Card className="p-6">
      <h2 className="mb-6 font-display text-2xl font-bold">Core Components</h2>
      <section>
        <h3 className="mb-2 font-display text-lg font-bold">Theory of Knowledge</h3>
        <ScoreBox score={`${tokTotal}/${TOK_MAX}`} letter={LETTERS[tokIdx]} />
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <PaperRow label="Theory of Knowledge essay" weight={2 / 3} value={tok.essay} max={10} onChange={(value) => dispatch({ type: 'setTok', field: 'essay', value })} />
          <PaperRow label="Theory of Knowledge exhibition" weight={1 / 3} value={tok.exhibition} max={10} onChange={(value) => dispatch({ type: 'setTok', field: 'exhibition', value })} />
        </div>
      </section>
      <section className="mt-10">
        <h3 className="mb-2 font-display text-lg font-bold">Extended Essay</h3>
        <ScoreBox score={`${ee}/${EE_MAX}`} letter={LETTERS[eeIdx]} />
        <PaperRow label="Extended Essay" weight={1} value={ee} max={EE_MAX} onChange={(value) => dispatch({ type: 'setEE', value })} />
      </section>
      <section className="mt-10">
        <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
          Core Points: <span className="font-bold text-primary">{points === 'fail' ? 'Fail' : points}</span>
        </h3>
        <div className="overflow-x-auto">
          <div className="grid min-w-[320px] grid-cols-6 gap-px overflow-hidden rounded-xl border-2 border-border bg-border text-center text-sm" role="table" aria-label="Core points matrix (rows: Extended Essay, columns: Theory of Knowledge)">
            <div className="bg-background p-2 text-xs text-muted-foreground">EE \ TOK</div>
            {display.map((l) => (
              <div key={`h-${l}`} className="bg-background p-2 font-bold">
                {l}
              </div>
            ))}
            {display.map((eeLetter) => {
              const eeI = LETTERS.indexOf(eeLetter);
              return [
                <div key={`r-${eeLetter}`} className="bg-background p-2 font-bold">
                  {eeLetter}
                </div>,
                ...display.map((tokLetter) => {
                  const tokI = LETTERS.indexOf(tokLetter);
                  const v = CORE_MATRIX[eeI][tokI];
                  const active = eeI === eeIdx && tokI === tokIdx;
                  return (
                    <div key={`c-${eeLetter}-${tokLetter}`} className={cn('p-2 font-medium', cellClass(v), active && 'ring-2 ring-inset ring-primary')}>
                      {v === null ? 'Fail' : v}
                    </div>
                  );
                }),
              ];
            })}
          </div>
        </div>
      </section>
    </Card>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit and push**

```bash
git add src/components/CoreSection.tsx
git commit -m "Add CoreSection with TOK/EE inputs and core points matrix

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Dfn27dVBEtGX22FpfCxNXH"
git push origin main
```

---

### Task 10: Scoresheet

**Files:**
- Create: `src/components/Scoresheet.tsx`

**Interfaces:**
- Consumes: `SubjectResult`, `diplomaFailures`, `statusLabel`, `tagline`, `totalPoints`, `LETTERS` (Task 5); `SUBJECTS` (Task 3); shadcn `Card`, `Badge`, `Table`.
- Produces: `Scoresheet({ subjects: SubjectResult[]; tokIdx: number; eeIdx: number; core: number | 'fail'; onReset(): void })`.

- [ ] **Step 1: Write `src/components/Scoresheet.tsx`**

```tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SUBJECTS } from '@/data/subjects';
import { diplomaFailures, LETTERS, statusLabel, tagline, totalPoints, type SubjectResult } from '@/lib/core';

interface ScoresheetProps {
  subjects: SubjectResult[];
  tokIdx: number;
  eeIdx: number;
  core: number | 'fail';
  onReset: () => void;
}

export function Scoresheet({ subjects, tokIdx, eeIdx, core, onReset }: ScoresheetProps) {
  const failures = diplomaFailures(subjects, core);
  const total = totalPoints(subjects, core);
  const hl = subjects.filter((s) => s.level === 'HL').length;
  const sl = subjects.length - hl;
  const complete = subjects.length === 6;
  const awarded = complete && failures.length === 0;

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold">Scoresheet</h2>
          <Badge variant={awarded ? 'default' : 'secondary'} className="mt-2">
            {statusLabel(subjects.length, failures)}
          </Badge>
        </div>
        <div className="text-right">
          <span className="font-display text-4xl font-bold text-primary">{total}</span>
          <span className="text-lg text-muted-foreground">/45</span>
          <p className="text-sm text-muted-foreground">{tagline(subjects.length, failures, total)}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-between text-sm text-muted-foreground">
        <p>
          {hl} HL · {sl} SL
        </p>
        <p>CGS 2026</p>
      </div>
      <Table className="mt-2">
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead className="text-right">Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center text-muted-foreground">
                No subjects selected yet.
              </TableCell>
            </TableRow>
          ) : (
            subjects.map((s, i) => (
              <TableRow key={`${s.subjectId}-${i}`}>
                <TableCell>
                  {s.level} {SUBJECTS[s.subjectId].name}
                </TableCell>
                <TableCell className="text-right font-semibold">{s.grade}</TableCell>
              </TableRow>
            ))
          )}
          <TableRow>
            <TableCell>Theory of Knowledge</TableCell>
            <TableCell className="text-right">{LETTERS[tokIdx]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Extended Essay</TableCell>
            <TableCell className="text-right">{LETTERS[eeIdx]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Core points</TableCell>
            <TableCell className="text-right">{core === 'fail' ? 'Fail' : `${core}/3`}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {complete && failures.length > 0 && (
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-destructive">
          {failures.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}
      <div className="mt-6 flex justify-end">
        <Button variant="outline" size="sm" onClick={onReset}>
          Reset all marks
        </Button>
      </div>
    </Card>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit and push**

```bash
git add src/components/Scoresheet.tsx
git commit -m "Add Scoresheet with totals, diploma status and reset

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Dfn27dVBEtGX22FpfCxNXH"
git push origin main
```

---

### Task 11: Calculator composition, page shell, fonts

**Files:**
- Create: `src/components/Calculator.tsx`
- Modify: `src/app/layout.tsx`, `src/app/page.tsx` (replace generated content)
- Delete: generated `public/*.svg` placeholders if present (`next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`)

**Interfaces:**
- Consumes: everything from Tasks 2–10.
- Produces: route `/` rendering the full calculator; `<Calculator />` client component.

- [ ] **Step 1: Write `src/components/Calculator.tsx`**

```tsx
'use client';

import { useEffect, useReducer, useState } from 'react';
import { CoreSection } from '@/components/CoreSection';
import { GroupCard } from '@/components/GroupCard';
import { Scoresheet } from '@/components/Scoresheet';
import { StepHeading } from '@/components/StepHeading';
import { GROUPS } from '@/data/groups';
import { corePoints, EE_BOUNDS, letterIndex, TOK_BOUNDS, tokScore, type SubjectResult } from '@/lib/core';
import { scoreSubject } from '@/lib/score';
import { initialState, reducer } from '@/lib/state';
import { loadState, saveState } from '@/lib/storage';

export function Calculator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadState();
    if (saved) dispatch({ type: 'hydrate', state: saved });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const chosenIds = GROUPS.map((g) => state.groups[g.key].subjectId).filter((id): id is NonNullable<typeof id> => id !== undefined);
  const counts = new Map<string, number>();
  for (const id of chosenIds) counts.set(id, (counts.get(id) ?? 0) + 1);

  const subjects: SubjectResult[] = GROUPS.flatMap((g) => {
    const gs = state.groups[g.key];
    if (!gs.subjectId || !gs.level) return [];
    return [{ subjectId: gs.subjectId, level: gs.level, grade: scoreSubject(gs.subjectId, gs.level, gs.marks).grade }];
  });

  const tokIdx = letterIndex(tokScore(state.tok.essay, state.tok.exhibition), TOK_BOUNDS);
  const eeIdx = letterIndex(state.ee, EE_BOUNDS);
  const core = corePoints(eeIdx, tokIdx);

  return (
    <div>
      <StepHeading number={1} label="Enter your subject marks" />
      <div className="space-y-4">
        {GROUPS.map((g) => (
          <GroupCard
            key={g.key}
            group={g}
            state={state.groups[g.key]}
            duplicate={state.groups[g.key].subjectId !== undefined && (counts.get(state.groups[g.key].subjectId as string) ?? 0) > 1}
            dispatch={dispatch}
          />
        ))}
      </div>
      <StepHeading number={2} label="Core points: EE and TOK marks" />
      <CoreSection tok={state.tok} ee={state.ee} dispatch={dispatch} />
      <StepHeading number={3} label="Results sheet" />
      <Scoresheet subjects={subjects} tokIdx={tokIdx} eeIdx={eeIdx} core={core} onReset={() => dispatch({ type: 'reset' })} />
    </div>
  );
}
```

- [ ] **Step 2: Replace `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', weight: ['600', '700', '800'], display: 'swap' });

export const metadata: Metadata = {
  title: 'CGS IB Trial Grade Calculator',
  description: 'Predict your IB grades from trial exam marks using CGS 2026 grade boundaries. Exam papers only — IAs are not counted.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Replace `src/app/page.tsx`**

```tsx
import Link from 'next/link';
import { Calculator } from '@/components/Calculator';

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-24 pt-10 sm:px-6">
      <header className="text-center">
        <span className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          CGS 2026 boundaries · 3-year average
        </span>
        <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          Estimate your{' '}
          <span className="text-primary underline decoration-primary/40 decoration-[6px] underline-offset-4">IB Score</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-muted-foreground">
          Predict your IB grades from your trial exam marks using CGS&apos;s 2026 grade boundaries. Exam papers only — IAs are not counted.
        </p>
      </header>
      <Link
        href="/boundaries"
        className="mt-10 flex items-center justify-between rounded-2xl border border-border p-5 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
      >
        <span>
          <span className="block text-lg font-medium">Grade boundaries</span>
          <span className="block text-sm text-muted-foreground">View the boundaries used for every subject</span>
        </span>
        <span aria-hidden className="text-muted-foreground">→</span>
      </Link>
      <Calculator />
    </main>
  );
}
```

- [ ] **Step 4: Remove placeholder SVGs and build**

```bash
rm -f public/next.svg public/vercel.svg public/file.svg public/globe.svg public/window.svg
pnpm exec tsc --noEmit && pnpm build
```

Expected: build succeeds; `/` is static (○). If the build reports a `Link` to `/boundaries` as missing, that is fine — the route is added in Task 12 (Next does not validate hrefs at build time).

- [ ] **Step 5: Smoke-test the rendered HTML**

```bash
(pnpm start -p 3111 > /private/tmp/claude-501/next.log 2>&1 &)
sleep 4
curl -s http://localhost:3111 | grep -oE 'Estimate your|Select subject|Core Components|Scoresheet|Pick all six subjects' | sort -u
pkill -f 'next start' || true
```

Expected: all five strings present.

- [ ] **Step 6: Commit and push**

```bash
git add -A
git commit -m "Compose calculator page with hero, fonts and persistence

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Dfn27dVBEtGX22FpfCxNXH"
git push origin main
```

---

### Task 12: Boundaries page

**Files:**
- Create: `src/app/boundaries/page.tsx`

**Interfaces:**
- Consumes: `BOUNDARIES`, `levelsFor` (Task 2), `GROUPS` (Task 3), `SUBJECTS` (Task 3), shadcn `Table`.
- Produces: route `/boundaries`.

- [ ] **Step 1: Write `src/app/boundaries/page.tsx`**

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BOUNDARIES, levelsFor } from '@/data/boundaries';
import { GROUPS } from '@/data/groups';
import { SUBJECTS } from '@/data/subjects';
import type { SubjectId } from '@/data/types';

export const metadata: Metadata = { title: 'Grade boundaries · CGS IB Trial Grade Calculator' };

/** Each subject listed once, under its home group (ESS under Group 3, per the PDF's "3/4" row order). */
const HOME_GROUP: Record<string, SubjectId[]> = {
  g1: ['english-lal', 'english-lit'],
  g2: ['chinese-b', 'french-ab', 'french-b', 'german-b', 'indonesian-ab', 'latin', 'spanish-ab'],
  g3: ['business', 'economics', 'geography', 'global-politics', 'history', 'philosophy', 'psychology', 'ess'],
  g4: ['biology', 'chemistry', 'computer-science', 'physics', 'sehs'],
  g5: ['maths-aa', 'maths-ai'],
  g6: ['music', 'theatre', 'visual-arts'],
};

function range(lower: number, next: number | undefined): string {
  return next === undefined ? `${lower}–100` : `${lower}–${next - 1}`;
}

export default function BoundariesPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-24 pt-10 sm:px-6">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to the calculator
      </Link>
      <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight">CGS IB grade boundaries 2026</h1>
      <p className="mt-2 text-muted-foreground">Three-year average, as a percentage of the subject&apos;s exam papers. Whole percentages; a mark on a boundary earns the higher grade.</p>
      {GROUPS.map((g) => (
        <section key={g.key} className="mt-10">
          <h2 className="mb-3 font-display text-xl font-bold">{g.label}</h2>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                    <TableHead key={n} className="text-right">
                      Grade {n}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {HOME_GROUP[g.key].flatMap((id) =>
                  [...levelsFor(id)].reverse().map((level) => {
                    const b = BOUNDARIES[id][level]!;
                    return (
                      <TableRow key={`${id}-${level}`}>
                        <TableCell className="whitespace-nowrap">
                          {SUBJECTS[id].name} {level}
                        </TableCell>
                        {b.map((lower, i) => (
                          <TableCell key={i} className="text-right">
                            {range(lower, b[i + 1])}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  }),
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      ))}
    </main>
  );
}
```

- [ ] **Step 2: Build and smoke-test**

```bash
pnpm build
(pnpm start -p 3111 > /private/tmp/claude-501/next.log 2>&1 &)
sleep 4
curl -s http://localhost:3111/boundaries | grep -oE 'Physics HL|82–100|Group 6: The Arts or Elective' | sort -u
pkill -f 'next start' || true
```

Expected: build lists `/boundaries` as static; all three strings present.

- [ ] **Step 3: Commit and push**

```bash
git add src/app/boundaries/page.tsx
git commit -m "Add grade boundaries page

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Dfn27dVBEtGX22FpfCxNXH"
git push origin main
```

---

### Task 13: Visual QA, README, deployment check

**Files:**
- Create: `README.md`
- Modify: any component needing a fix found during QA

- [ ] **Step 1: Run the full test suite and lint**

Run: `pnpm test && pnpm lint && pnpm build`
Expected: all green.

- [ ] **Step 2: Screenshot desktop and mobile with Playwright's bundled Chromium**

```bash
pnpm dlx playwright@latest install chromium
(pnpm start -p 3111 > /private/tmp/claude-501/next.log 2>&1 &)
sleep 4
pnpm dlx playwright@latest screenshot --full-page --viewport-size=1280,900 http://localhost:3111 /private/tmp/claude-501/desktop.png
pnpm dlx playwright@latest screenshot --full-page --viewport-size=390,844 http://localhost:3111 /private/tmp/claude-501/mobile.png
pnpm dlx playwright@latest screenshot --full-page --viewport-size=1280,900 --color-scheme=dark http://localhost:3111 /private/tmp/claude-501/dark.png
pkill -f 'next start' || true
```

Read the three PNGs and check: hero pill + accent underline; six group cards with "Select subject"; core card with matrix; scoresheet showing `0/45` and "Pick all six subjects to get a prediction."; nothing overflows horizontally on mobile; dark mode has readable contrast. Fix anything wrong in the component files, re-run `pnpm build`.

- [ ] **Step 3: Interactive check with a Playwright script**

Create `/private/tmp/claude-501/e2e.mjs`:

```js
import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto('http://localhost:3111');
// Group 4 → Physics → HL
await page.getByRole('combobox', { name: 'Group 4: Sciences subject' }).click();
await page.getByRole('option', { name: 'Physics' }).click();
await page.getByRole('combobox', { name: 'Group 4: Sciences level' }).click();
await page.getByRole('option', { name: 'HL' }).click();
await page.getByLabel('Paper 1A: Multiple choice', { exact: true }).fill('30');
await page.getByLabel('Paper 1B: Data-based', { exact: true }).fill('15');
await page.getByLabel('Paper 2', { exact: true }).fill('60');
const text = await page.getByText('Total Weighted Score:').locator('../..').innerText();
console.log(text);
if (!text.includes('70/100') || !text.includes('7/7')) throw new Error('Physics HL example did not score 70 → 7');
await page.reload();
const after = await page.getByText('Total Weighted Score:').locator('../..').innerText();
if (!after.includes('70/100')) throw new Error('marks did not persist across reload');
await page.screenshot({ path: '/private/tmp/claude-501/physics.png', fullPage: true });
await browser.close();
console.log('OK');
```

```bash
cd /private/tmp/claude-501 && (test -f package.json || pnpm init >/dev/null) && pnpm add playwright@latest >/dev/null
cd /Users/junlee/Documents/programming/cgs-ibtrial-calc
(pnpm start -p 3111 > /private/tmp/claude-501/next.log 2>&1 &)
sleep 4
(cd /private/tmp/claude-501 && node e2e.mjs)
pkill -f 'next start' || true
```

Expected: prints the two score lines containing `70/100` and `7/7`, then `OK`. (`exact: true` is required because each slider's aria-label is `<label> mark`, which would otherwise also match.)

- [ ] **Step 4: Write `README.md`**

```markdown
# CGS IB Trial Grade Calculator

Enter trial-exam paper marks, get the IB grade each subject would earn under CGS's 2026 grade boundaries (3-year average), plus TOK/EE core points and a total out of 45.

- **Exam papers only.** Internal assessments and externally-marked coursework are excluded; the remaining paper weights are rescaled to 100%.
- Paper structures are verified for the **November 2026** session (new Global Politics, ESS, SEHS and Business Management guides; English A Paper 2 out of 25).
- Music, Theatre and Visual Arts have no written exam, so they take a single trial mark out of 100.

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm test       # Vitest
pnpm build
```

## Where the numbers live

- `src/data/boundaries.ts` — school boundaries (from the PDF in the repo root)
- `src/data/subjects.ts` — papers, max marks and IB weights per subject/level
- `src/lib/score.ts` — reweighting and grade lookup
- `src/lib/core.ts` — TOK/EE letters, core points, diploma rules

Design spec: `docs/superpowers/specs/2026-08-26-ib-trial-calculator-design.md`.
```

- [ ] **Step 5: Commit and push, then confirm Vercel deployed**

```bash
git add -A
git commit -m "Add README and QA fixes

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Dfn27dVBEtGX22FpfCxNXH"
git push origin main
sleep 90
vercel ls cgs-ibtrial-calc --scope junlee-3 2>&1 | head -8
```

Expected: the latest deployment for `main` shows `● Ready` with a production URL (`https://cgs-ibtrial-calc.vercel.app` or the team-suffixed variant). If the list shows no Git-triggered deployment, run `vercel --prod --yes --scope junlee-3` as a fallback and report that the Git connection needs finishing in the Vercel dashboard. Open the production URL with `curl -s <url> | grep -c 'Estimate your'` — expected `1`.
