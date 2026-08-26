# CGS IB Trial Grade Calculator — Design

**Date:** 2026-08-26
**Status:** Approved (design); spec pending user review
**Repo:** github.com/junlee-3/cgs-ibtrial-calc → Vercel (team "Jun", auto-deploy from `main`)

## 1. Purpose

A single-page website where CGS IB students enter the raw marks from their **trial exam papers** and see, per subject, the IB grade (1–7) that mark would earn under the school's **2026 grade boundaries (3-year average)**, plus TOK/EE core points and a total out of 45.

It deliberately copies the structure, flow and copy of https://www.revisiondojo.com/grade-calculator, with these differences:

- Boundaries are the school's (one fixed set) — there is no session/timezone picker.
- **Only timed exam papers count.** Internal assessments and externally-marked coursework (HL essay, Latin HL composition, Economics portfolio, Global Politics engagement project) are excluded, and the remaining exam weights are rescaled to sum to 100%.
- Subject list is the school's (specific languages rather than a generic "Language B" + language picker).
- Arts subjects with no written exam get a single "Trial mark" input out of 100.
- No mascot/brand assets; own accent colour.

## 2. Users and success criteria

- Users: Year 12 students on phones and laptops, no login.
- Success: a student can pick their six subjects, type paper marks, and read a correct grade per subject and a total /45 in under two minutes; results survive a page refresh; page works on a phone.

## 3. Tech stack

- Next.js (App Router, latest stable) + TypeScript, `src/` layout.
- Tailwind CSS v4 + shadcn/ui components: `Select`, `Slider`, `Input`, `Card`, `Badge`, `Table`.
- Vitest for unit tests.
- Fully static client rendering (the calculator is a client component); no API routes, no database, no env vars.
- Fonts via `next/font/google`: Manrope (display), Inter (body). Tabular numerals for all numbers.
- Deployed by Vercel from GitHub `main`; no build config beyond defaults.

## 4. Data

### 4.1 Grade boundaries (`src/data/boundaries.ts`)

Transcribed from `IB_Grade_Boundaries 3 year average for 2026.pdf`. Each row stores the **lower bound** (inclusive, whole percent) for grades 1–7. The PDF row "German SL" is a duplicate of "German B SL" and is dropped (user decision). 49 rows.

| id | Subject | Level | Lower bounds g1…g7 |
|---|---|---|---|
| english-lal | English A: Language and Literature | HL | 0, 15, 29, 43, 56, 68, 82 |
| english-lal | English A: Language and Literature | SL | 0, 13, 28, 41, 51, 68, 82 |
| english-lit | English A: Literature | HL | 0, 14, 28, 41, 55, 67, 81 |
| english-lit | English A: Literature | SL | 0, 12, 25, 39, 53, 66, 80 |
| chinese-b | Chinese B | HL | 0, 12, 24, 45, 58, 71, 84 |
| chinese-b | Chinese B | SL | 0, 13, 27, 42, 56, 70, 83 |
| french-ab | French ab initio | SL | 0, 13, 28, 43, 55, 67, 79 |
| french-b | French B | SL | 0, 12, 25, 38, 53, 68, 82 |
| german-b | German B | SL | 0, 10, 21, 36, 51, 66, 81 |
| indonesian-ab | Indonesian ab initio | SL | 0, 10, 23, 36, 49, 63, 76 |
| latin | Latin | HL | 0, 12, 26, 38, 57, 66, 79 |
| latin | Latin | SL | 0, 12, 25, 38, 51, 62, 75 |
| spanish-ab | Spanish ab initio | SL | 0, 12, 25, 39, 53, 66, 81 |
| business | Business Management | HL | 0, 14, 27, 39, 50, 60, 71 |
| business | Business Management | SL | 0, 16, 31, 44, 55, 67, 79 |
| economics | Economics | HL | 0, 13, 25, 37, 47, 64, 77 |
| economics | Economics | SL | 0, 15, 29, 42, 54, 67, 80 |
| geography | Geography | HL | 0, 14, 29, 43, 54, 65, 76 |
| geography | Geography | SL | 0, 14, 29, 41, 53, 66, 78 |
| global-politics | Global Politics | HL | 0, 10, 22, 35, 47, 60, 72 |
| global-politics | Global Politics | SL | 0, 9, 21, 32, 43, 56, 66 |
| history | History | HL | 0, 14, 28, 38, 51, 62, 74 |
| history | History | SL | 0, 14, 29, 39, 52, 63, 77 |
| philosophy | Philosophy | HL | 0, 11, 23, 39, 53, 66, 80 |
| philosophy | Philosophy | SL | 0, 11, 23, 35, 50, 64, 79 |
| psychology | Psychology | HL | 0, 9, 20, 35, 47, 60, 72 |
| psychology | Psychology | SL | 0, 10, 21, 36, 49, 59, 72 |
| ess | Environmental Systems and Societies | HL | 0, 11, 22, 32, 43, 57, 69 |
| ess | Environmental Systems and Societies | SL | 0, 11, 23, 33, 44, 58, 69 |
| biology | Biology | HL | 0, 14, 24, 36, 50, 64, 78 |
| biology | Biology | SL | 0, 14, 26, 40, 52, 65, 77 |
| chemistry | Chemistry | HL | 0, 16, 27, 39, 52, 64, 76 |
| chemistry | Chemistry | SL | 0, 15, 28, 44, 54, 65, 75 |
| computer-science | Computer Science | HL | 0, 15, 30, 44, 53, 61, 70 |
| computer-science | Computer Science | SL | 0, 15, 32, 45, 55, 64, 73 |
| physics | Physics | HL | 0, 14, 24, 37, 48, 58, 69 |
| physics | Physics | SL | 0, 14, 26, 39, 48, 59, 69 |
| sehs | Sports, Exercise and Health Science | HL | 0, 14, 23, 36, 48, 61, 74 |
| sehs | Sports, Exercise and Health Science | SL | 0, 14, 25, 39, 53, 67, 80 |
| maths-aa | Mathematics: Analysis and Approaches | HL | 0, 13, 25, 35, 49, 63, 78 |
| maths-aa | Mathematics: Analysis and Approaches | SL | 0, 13, 25, 37, 52, 67, 80 |
| maths-ai | Mathematics: Applications and Interpretation | HL | 0, 14, 27, 38, 51, 64, 77 |
| maths-ai | Mathematics: Applications and Interpretation | SL | 0, 13, 25, 38, 53, 67, 80 |
| music | Music | HL | 0, 11, 22, 39, 53, 67, 81 |
| music | Music | SL | 0, 11, 21, 38, 52, 65, 78 |
| theatre | Theatre | HL | 0, 10, 21, 35, 51, 67, 83 |
| theatre | Theatre | SL | 0, 10, 20, 34, 51, 67, 83 |
| visual-arts | Visual Arts | HL | 0, 10, 20, 39, 53, 66, 81 |
| visual-arts | Visual Arts | SL | 0, 11, 22, 34, 50, 65, 80 |

### 4.2 Subject catalogue (`src/data/subjects.ts`)

For each subject id: display name, IB groups it can be chosen in, levels offered (exactly the levels present in 4.1), and per level the list of **assessment components** verified for the **November 2026 session**:

```ts
type ComponentKind = 'exam' | 'coursework' | 'internal';
interface Component { name: string; kind: ComponentKind; maxMarks: number; ibWeight: number /* % of IB grade */ }
```

Only `kind: 'exam'` components are shown and scored; the others are kept in the data so the exclusion is explicit and auditable. Verified figures (IB weight in %):

| Subject | SL components | HL components |
|---|---|---|
| English A: L&L | P1 Guided textual analysis /20 (35) · P2 Comparative essay /25 (35) · IO /40 (30, internal) | P1 /40 (35) · P2 /25 (25) · HL essay /20 (20, coursework) · IO /40 (20, internal) |
| English A: Lit | P1 Guided literary analysis /20 (35) · P2 /25 (35) · IO /40 (30, internal) | P1 /40 (35) · P2 /25 (25) · HL essay /20 (20, coursework) · IO /40 (20, internal) |
| Chinese B (SL & HL), French B, German B | P1 Writing /30 (25) · P2 Listening /25 (25) · P2 Reading /40 (25) · Individual oral /30 (25, internal) | same as SL |
| French / Indonesian / Spanish ab initio | same as Language B | — |
| Latin | P1 /30 (35) · P2 /32 (35) · Research dossier /28 (30, internal) | P1 /40 (30) · P2 /32 (30) · HL composition /25 (20, coursework) · Research dossier /28 (20, internal) |
| Business Management | P1 /30 (35) · P2 /40 (35) · IA /25 (30) | P1 /30 (25) · P2 /50 (30) · P3 /25 (25) · IA /25 (20) |
| Economics | P1 /25 (30) · P2 /40 (40) · Portfolio /45 (30, internal) | P1 /25 (20) · P2 /40 (30) · P3 /60 (30) · Portfolio /45 (20, internal) |
| Geography | P1 /40 (35) · P2 /50 (40) · Fieldwork /25 (25, internal) | P1 /60 (35) · P2 /50 (25) · P3 /28 (20) · Fieldwork /25 (20, internal) |
| Global Politics (2026 guide) | P1 /25 (30) · P2 /30 (40) · Engagement project /24 (30, internal) | P1 /25 (20) · P2 /30 (30) · P3 /28 (30) · Engagement project /30 (20, internal) |
| History | P1 /24 (30) · P2 /30 (45) · IA /25 (25) | P1 /24 (20) · P2 /30 (25) · P3 /45 (35) · IA /25 (20) |
| Philosophy | P1 /50 (50) · P2 /25 (25) · IA /25 (25) | P1 /75 (40) · P2 /25 (20) · P3 /25 (20) · IA /25 (20) |
| Psychology (2019 guide) | P1 /49 (50) · P2 /22 (25) · IA /22 (25) | P1 /49 (40) · P2 /44 (20) · P3 /24 (20) · IA /22 (20) |
| ESS (2026 guide) | P1 /35 (25) · P2 /60 (50) · IA /30 (25) | P1 /70 (30) · P2 /80 (50) · IA /30 (20) |
| Biology | P1A Multiple choice /30 · P1B Data-based /25 (36 combined) · P2 /50 (44) · IA /24 (20) | P1A /40 · P1B /35 (36) · P2 /80 (44) · IA /24 (20) |
| Chemistry | P1A /30 · P1B /25 (36) · P2 /50 (44) · IA /24 (20) | P1A /40 · P1B /35 (36) · P2 /90 (44) · IA /24 (20) |
| Physics | P1A /25 · P1B /20 (36) · P2 /50 (44) · IA /24 (20) | P1A /40 · P1B /20 (36) · P2 /90 (44) · IA /24 (20) |
| Computer Science (2014 guide) | P1 /70 (45) · P2 /45 (25) · IA /34 (30) | P1 /100 (40) · P2 /65 (20) · P3 /30 (20) · IA /34 (20) |
| SEHS (2026 guide) | P1A /30 · P1B /25 (36) · P2 /50 (40) · IA /24 (24) | P1A /40 · P1B /25 (36) · P2 /80 (40) · IA /24 (24) |
| Maths AA | P1 (no calculator) /80 (40) · P2 /80 (40) · IA /20 (20) | P1 /110 (30) · P2 /110 (30) · P3 /55 (20) · IA /20 (20) |
| Maths AI | P1 /80 (40) · P2 /80 (40) · IA /20 (20) | P1 /110 (30) · P2 /110 (30) · P3 /55 (20) · IA /20 (20) |
| Music, Theatre, Visual Arts | single component "Trial mark" /100, kind `exam`, ibWeight 100 | same |

Sciences: the IB publishes one 36% weight for Paper 1 (1A+1B together). The data stores 1A and 1B as separate components with `ibWeight = 36 × marks / (marks1A + marks1B)`, which is arithmetically identical to summing the raw marks.

Confidence: all figures verified against IB guide text plus ≥1 secondary source, except ESS Paper 2 totals (SL 60, HL 80), which rest on three concordant secondary sources because the guide was not fetchable. Every constant lives in `subjects.ts` so a correction is a one-line change.

### 4.3 Group → subject dropdown map (mirrors RevisionDojo `GROUP_MAP`)

- Group 1: Studies in Language and Literature → english-lal, english-lit
- Group 2: Language Acquisition → chinese-b, french-b, german-b, french-ab, indonesian-ab, spanish-ab, latin, **plus** english-lal, english-lit
- Group 3: Individuals and Societies → business, economics, ess, geography, global-politics, history, philosophy, psychology
- Group 4: Sciences → biology, chemistry, computer-science, ess, physics, sehs
- Group 5: Mathematics → maths-aa, maths-ai
- Group 6: The Arts or Elective → music, theatre, visual-arts, **plus every subject from Groups 1–4** (not Maths)

Dropdowns are alphabetical. Level dropdown shows only the levels that exist for that subject in 4.1.

## 5. Scoring rules (`src/lib/score.ts`, pure functions)

1. `examComponents(subjectId, level)` → components with `kind === 'exam'`.
2. `trialWeights(components)` → `w_i = ibWeight_i / Σ ibWeight_exam` (fractions summing to 1). Displayed as `Math.round(w_i × 100)%`.
3. `weightedPercent(components, marks)` → `Σ (mark_i / maxMarks_i) × w_i × 100`. Missing marks count as 0. Marks are clamped to `[0, maxMarks]` integers on input.
4. `gradeFor(percent, lowerBounds)` → `p = roundPercent(percent)` — the percent is snapped to 9 decimal places before `Math.round` so exact .5 ties produced by floating-point sums round up; grade = number of lower bounds `≤ p` (1–7). A subject with no marks entered has percent 0 → grade 1 (as RevisionDojo).
5. TOK: `essay` /10, `exhibition` /10; `tokScore = 2·essay + exhibition` (out of 30); letter from lower bounds `E 0, D 4, C 10, B 16, A 22`.
6. EE: `ee` /34; letter from lower bounds `E 0, D 6, C 13, B 20, A 26`.
7. Core points matrix `[EE][TOK]` with index order E,D,C,B,A (F = fail):
   ```
   EE\TOK  E  D  C  B  A
   E       F  F  F  F  F
   D       F  0  0  1  2
   C       F  0  1  2  2
   B       F  1  2  2  3
   A       F  2  2  3  3
   ```
8. Total = Σ subject grades + core points (fail counts as 0 points but flags the diploma).
9. Diploma checks (evaluated only when 6 subjects are selected; messages are RevisionDojo's):
   - fewer than 3 HL → "You must take at least 3 HL subjects."
   - same subject chosen twice → "Your subject selection does not meet IB Diploma requirements." with the duplicate named
   - total < 24 → "Less than 24 total points."
   - any grade 1 → "Cannot have any grade 1."
   - more than two 2s → "More than two grade 2s."
   - more than three 3s → "More than three grade 3s."
   - HL points (best three HL if four) < 12 → "Less than 12 HL points." / "Less than 12 points across the three highest HLs."
   - SL points < 9 with 3 SL, or < 5 with 2 SL → "Less than 9 SL points." / "Less than 5 SL points."
   - TOK or EE = E → "TOK or EE grade is E (automatic fail)."
   Result badge: "Diploma awarded" / "Diploma not awarded". Tagline: <6 subjects → "Pick all six subjects to get a prediction."; awarded & total ≥ 40 → "Top of the cohort. Keep it up."; ≥ 35 → "Strong score – you're doing well."; otherwise awarded → "On track for the diploma."; not awarded → "Diploma at risk – see what to fix below."

## 6. UI

Single route `/` plus `/boundaries`.

**Hero** — `h1` "Estimate your IB Score" (accent underline on "IB Score" as on RevisionDojo), subtitle "Predict your IB grades from your trial exam marks using CGS's 2026 grade boundaries. Exam papers only — IAs are not counted.", a pill "CGS 2026 boundaries · 3-year average", and a link card "Grade boundaries — view the boundaries used for every subject" → `/boundaries`.

**Step 1 — "Enter your subject marks"** (numbered step heading like RevisionDojo). Six `Card`s titled "Group 1: Studies in Language and Literature" … "Group 6: The Arts or Elective". Each card: `Select subject` (placeholder text exactly that) → `Select level`. When both are set, a divider then:
- left: `ScoreDial` — circular progress ring, 0–7, big grade digit in the middle;
- right: "Total Weighted Score: **N**/100" and "Predicted IB Grade: **N**/7";
- below: one `PaperRow` per exam component: name on the left, "Weight: N%" muted on the right; underneath a `Slider` (step 1, max = maxMarks) and a numeric `Input` followed by "/ max". Slider and input stay in sync.
- Arts subjects show one row "Trial mark" / 100.
- A subject chosen in two groups shows an inline warning on the second card.

**Step 2 — "Core points: EE and TOK marks"**. Card "Core Components": section "Theory of Knowledge" with a filled sub-card (Score `N/30` · Awarded Grade `X`) and two `PaperRow`s ("Theory of Knowledge essay" weight 67% /10, "Theory of Knowledge exhibition" weight 33% /10); section "Extended Essay" (Score `N/34` · Awarded Grade `X`, one row /34); "Core Points: **N**" and the 5×5 matrix (A–E headers, cells coloured emerald 3/2, yellow 1, amber 0, red Fail, current cell ringed).

**Step 3 — "Results sheet"**. Card "Scoresheet": header row with a status `Badge` ("Select N more subjects" or Diploma awarded/not awarded), big **N**/45, tagline, "N HL · M SL" and "CGS 2026". `Table` Subject | Grade with one row per chosen subject labelled "HL Physics" style, or "No subjects selected yet."; then fixed rows Theory of Knowledge, Extended Essay, Core points. Below: the list of failed diploma checks, if any.

**`/boundaries`** — the 4.1 table grouped by IB group, plus the source note "3-year average, 2026".

**State** — one `CalculatorState` object `{ groups: Record<GroupKey, { subjectId?, level?, marks: Record<componentName, number> }>, tok: { essay, exhibition }, ee: number }` in a `useReducer`, mirrored to `localStorage` key `cgs-ib-trial-v1` (write on change, read once on mount, ignore parse errors). A "Reset" button clears it.

**Visual system** — neutral zinc surfaces (`#fff` / `#0a0a0a` cards, `#f5f5f5` / `#1a1a1a` muted), accent indigo-violet (`#5B4FE9` light, `#8B82FF` dark) used only for the dials, the /45 number, the hero underline and focus rings; semantic emerald/amber/red for the matrix and diploma status. Manrope 700 for headings and grade digits, Inter for body, `font-variant-numeric: tabular-nums` everywhere numbers appear. Rounded-2xl cards, soft 1px borders, no shadows. Dark mode follows `prefers-color-scheme`. Visible keyboard focus; `prefers-reduced-motion` disables the dial animation. Layout: max-width 56rem column, cards full-width, paper rows two-up on ≥ md.

## 7. Error and edge handling

- Non-numeric / out-of-range input → clamped, never NaN (`clamp(Math.round(n), 0, max)`).
- Changing subject or level resets that group's marks.
- ESS or an English course chosen twice → warning; it still scores but the diploma check fails.
- Boundaries and components are validated at test time, not at runtime.
- No network calls, so no loading/error states beyond localStorage parse failure (silently start empty).

## 8. Testing

- `score.test.ts`: reweighting sums to 1; weighted percent for a worked example (Physics HL 1A 30/40, 1B 15/20, P2 60/90 → trial weights 30% / 15% / 55% → 22.5 + 11.25 + 36.67 = 70.4 → rounds to 70 → grade 7 since the grade-7 boundary is 69); rounding at the boundary (81.5 → 82 → 7; 81.4 → 81 → 6); zero marks → grade 1; full marks → 7; TOK/EE letters at each threshold; core matrix spot checks (A/A=3, E/x=fail, C/D=0); diploma rules each triggered once; best-three-HL rule with four HLs.
- `data.test.ts`: every boundary row has a subject entry with that level; every subject/level has ≥1 exam component; exam ibWeights match the 4.2 table's totals (sciences 36+44=80, etc.); all lower-bound arrays are 7 long, start at 0, strictly increasing, ≤ 100; group map only references known ids.
- `next build` passes; manual check in the browser (desktop + mobile width) before the final push.

## 9. Repository layout

```
src/app/layout.tsx, page.tsx, boundaries/page.tsx, globals.css
src/components/{StepHeading,GroupCard,PaperRow,ScoreDial,CoreSection,Scoresheet}.tsx
src/components/ui/*            (shadcn)
src/data/boundaries.ts, subjects.ts, groups.ts
src/lib/score.ts, storage.ts
src/lib/__tests__/score.test.ts, data.test.ts
docs/superpowers/specs/, docs/superpowers/plans/
```

## 10. Deployment

- Every unit of work is committed and pushed to `main`.
- Vercel project created from the GitHub repo via the Vercel integration under team "Jun" (`team_iVCyTV4v49kaDHpdcEY7xVTg`); production = `main`. Framework auto-detected (Next.js), no env vars.

## 11. Out of scope

Accounts, saving/sharing results, session-specific IB boundaries, university-requirement comparisons, the IA/coursework components (kept in data only), analytics.
