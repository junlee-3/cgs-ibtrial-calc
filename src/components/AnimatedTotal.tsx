'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

/** Rolling total counter for the scoresheet /45 display. */
export function AnimatedTotal({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const digits = String(value).split('');

  return (
    <span className="inline-flex overflow-hidden font-display text-4xl font-bold text-primary tabular-nums" aria-label={`${value} out of 45`}>
      <AnimatePresence mode="popLayout" initial={false}>
        {digits.map((d, i) => (
          <motion.span
            key={`${i}-${d}-${value}`}
            initial={reduce ? false : { y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? undefined : { y: -28, opacity: 0 }}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 26, delay: i * 0.03 }}
            className="inline-block"
          >
            {d}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}
