/** Compact CGS mark in Chrysalis coral/purple language. Not an official logo. */
export function CgsMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <rect x="2" y="2" width="36" height="36" rx="12" fill="#FFF0E8" stroke="#D4D4D4" />
      <path
        d="M12 26c3.2-6.5 6.4-9.8 8-9.8s4.8 3.3 8 9.8"
        stroke="#FF6B35"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="20" cy="14" r="3.2" fill="#8B7EC8" />
      <text x="20" y="33" textAnchor="middle" fill="#555555" fontSize="5.5" fontWeight="600" fontFamily="ui-monospace, monospace" letterSpacing="0.12em">
        CGS
      </text>
    </svg>
  );
}
