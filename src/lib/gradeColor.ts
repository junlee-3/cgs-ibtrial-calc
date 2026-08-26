/** Colour bands for IB grades 1–7 — cools toward CGS navy as performance rises. */
export function gradeHue(grade: number): string {
  const g = Math.max(0, Math.min(7, Math.round(grade)));
  switch (g) {
    case 0:
      return '#94a3b8';
    case 1:
      return '#b91c1c';
    case 2:
      return '#c2410c';
    case 3:
      return '#b45309';
    case 4:
      return '#a16207';
    case 5:
      return '#0e7490';
    case 6:
      return '#1d4ed8';
    case 7:
      return '#0b2c4a';
    default:
      return '#0b2c4a';
  }
}

export function gradeLabel(grade: number): string {
  if (grade >= 6) return 'Strong';
  if (grade === 5) return 'Solid';
  if (grade === 4) return 'Passing';
  if (grade >= 1) return 'Needs work';
  return 'Enter marks';
}
