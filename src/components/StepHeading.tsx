export function StepHeading({ number, label }: { number: number; label: string }) {
  return (
    <div className="mt-12 mb-4 flex items-center gap-3">
      <span className="flex size-8 items-center justify-center rounded-full bg-primary font-display text-base font-bold text-primary-foreground">
        {number}
      </span>
      <h2 className="text-xl font-medium">{label}</h2>
    </div>
  );
}
