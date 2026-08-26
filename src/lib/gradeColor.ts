/** IB grade colours mapped onto the Chrysalis coral → purple → green ladder. */
export function gradeHue(grade: number): string {
  const g = Math.max(0, Math.min(7, Math.round(grade)));
  switch (g) {
    case 0:
      return '#767676';
    case 1:
      return '#C43D0F';
    case 2:
      return '#E04E1A';
    case 3:
      return '#FF6B35';
    case 4:
      return '#8B7EC8';
    case 5:
      return '#6C5FAE';
    case 6:
      return '#2D8B5E';
    case 7:
      return '#1F6B47';
    default:
      return '#1F6B47';
  }
}

export function gradeLabel(grade: number): string {
  if (grade >= 6) return 'Strong';
  if (grade === 5) return 'Solid';
  if (grade === 4) return 'Passing';
  if (grade >= 1) return 'Needs work';
  return 'Enter marks';
}
