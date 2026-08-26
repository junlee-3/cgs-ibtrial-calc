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
