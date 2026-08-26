'use client';

import { useId } from 'react';
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
  const inputId = useId();
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex w-full items-center justify-between gap-2 text-base font-medium">
        <label htmlFor={inputId}>{label}</label>
        <span className="text-sm text-muted-foreground">Weight: {Math.round(weight * 100)}%</span>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <Slider min={0} max={max} step={1} value={[value]} onValueChange={(next) => { const [v] = Array.isArray(next) ? next : [next]; onChange(clampMark(v, max)); }} aria-label={`${label} mark`} />
        <div className="flex shrink-0 items-center gap-1">
          <Input
            id={inputId}
            type="number"
            inputMode="numeric"
            min={0}
            max={max}
            value={value}
            onChange={(e) => onChange(clampMark(Number(e.target.value), max))}
            className="h-9 w-16 border-none bg-transparent px-1 text-right text-lg font-semibold shadow-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span className="text-base text-muted-foreground">/ {max}</span>
        </div>
      </div>
    </div>
  );
}
