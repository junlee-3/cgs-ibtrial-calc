export function StepHeading({ number, label }: { number: number; label: string }) {
  return (
    <div className="mt-12 mb-4 flex items-center gap-3">
      <span className="flex size-8 items-center justify-center rounded-full bg-coral-light font-mono text-sm font-semibold text-coral-text">
        {number}
      </span>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{label}</h2>
    </div>
  );
}
