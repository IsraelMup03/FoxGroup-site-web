export default function Logo({ className = 'h-7 w-7' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
      <path d="M5 5l7.5 7.5h7L27 5v11a11 11 0 0 1-22 0z" />
      <path d="M12 19.5l4 3 4-3" />
    </svg>
  );
}
