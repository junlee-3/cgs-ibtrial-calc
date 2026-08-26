'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { gradeHue, gradeLabel } from '@/lib/gradeColor';

export function ScoreDial({ grade, size = 88 }: { grade: number; size?: number }) {
  const reduce = useReducedMotion();
  const stroke = 8;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const fraction = Math.max(0, Math.min(1, grade / 7));
  const centre = size / 2;
  const color = gradeHue(grade);
  const digit = Math.max(0, Math.min(7, Math.round(grade)));

  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Predicted grade ${grade} out of 7`} className="shrink-0">
        <circle cx={centre} cy={centre} r={r} fill="none" strokeWidth={stroke} stroke="#F5F5F5" />
        <motion.circle
          cx={centre}
          cy={centre}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke={color}
          strokeDasharray={circumference}
          initial={false}
          animate={{ strokeDashoffset: circumference * (1 - fraction), stroke: color }}
          transition={reduce ? { duration: 0 } : { duration: 0.32, ease: [0.2, 0, 0, 1] }}
          transform={`rotate(-90 ${centre} ${centre})`}
        />
        <foreignObject x={centre - 18} y={centre - 18} width={36} height={36}>
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={digit}
                initial={reduce ? false : { y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={reduce ? undefined : { y: -18, opacity: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.2, ease: [0.2, 0, 0, 1] }}
                className="absolute text-2xl font-semibold tabular-nums"
                style={{ color }}
              >
                {digit}
              </motion.span>
            </AnimatePresence>
          </div>
        </foreignObject>
      </svg>
      <span className="font-mono text-[11px] font-medium tracking-[0.12em] uppercase" style={{ color }}>
        {gradeLabel(grade)}
      </span>
    </div>
  );
}
