/** Compact IB badge using Chrysalis palette. Not an official IBO logo. */
export function IbMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="International Baccalaureate">
      <rect x="0.5" y="0.5" width="71" height="27" rx="8" fill="#FFFFFF" stroke="#D4D4D4" />
      <circle cx="14" cy="14" r="5.5" stroke="#8B7EC8" strokeWidth="1.5" fill="#F0EDFF" />
      <path d="M11.5 14h5M14 11.5v5" stroke="#6C5FAE" strokeWidth="1.2" strokeLinecap="round" />
      <text x="26" y="17.5" fill="#1A1A1A" fontSize="11" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif" letterSpacing="0.06em">
        IB
      </text>
      <text x="42" y="17.5" fill="#767676" fontSize="8" fontWeight="600" fontFamily="ui-monospace, monospace" letterSpacing="0.08em">
        DIPLOMA
      </text>
    </svg>
  );
}
