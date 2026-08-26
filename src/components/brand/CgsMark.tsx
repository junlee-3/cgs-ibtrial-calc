/** Simple CGS crest-inspired mark — navy shield with gold chevron. Not an official logo. */
export function CgsMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <path
        d="M20 2.5c6.5 2.8 11.5 3.4 15 3.6v14.2c0 8.4-5.6 14.8-15 17.2C10.6 35.1 5 28.7 5 20.3V6.1c3.5-.2 8.5-.8 15-3.6Z"
        fill="#0B2C4A"
      />
      <path d="M12 16.5h16l-8 9-8-9Z" fill="#C5A35A" />
      <path d="M14.5 15h11v1.5H14.5V15Z" fill="#3D7EB5" />
      <text x="20" y="13" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
        CGS
      </text>
    </svg>
  );
}
