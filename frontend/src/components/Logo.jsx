export default function Logo({ className = 'h-8 w-8' }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-lg bg-white p-1 ${className}`}>
      <img src="/logo.png" alt="FoxGroup" className="h-full w-full object-contain" />
    </span>
  );
}
