# CGS IB Trial Grade Calculator

Enter trial-exam paper marks, get the IB grade each subject would earn under CGS's 2026 grade boundaries (3-year average), plus TOK/EE core points and a total out of 45. For cgs class of 2026

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
