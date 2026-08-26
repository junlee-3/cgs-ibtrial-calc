/** Compact IB wordmark-style badge for school tools. Not an official IBO logo. */
export function IbMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="International Baccalaureate">
      <rect x="0.5" y="0.5" width="71" height="27" rx="6" fill="#0B2C4A" stroke="#3D7EB5" />
      <circle cx="14" cy="14" r="6" stroke="#C5A35A" strokeWidth="1.5" fill="none" />
      <path d="M11 14h6M14 11v6" stroke="#C5A35A" strokeWidth="1.2" strokeLinecap="round" />
      <text x="26" y="17.5" fill="white" fontSize="11" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif" letterSpacing="0.08em">
        IB
      </text>
      <text x="42" y="17.5" fill="#9EC4E0" fontSize="8" fontWeight="600" fontFamily="ui-sans-serif, system-ui, sans-serif" letterSpacing="0.04em">
        DIPLOMA
      </text>
    </svg>
  );
}
