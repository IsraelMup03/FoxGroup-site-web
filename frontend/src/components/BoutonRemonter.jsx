import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BoutonRemonter() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const surDefilement = () => setVisible(window.scrollY > 560);
    surDefilement();
    window.addEventListener('scroll', surDefilement, { passive: true });
    return () => window.removeEventListener('scroll', surDefilement);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Remonter en haut de la page"
      className={`fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-encre text-white shadow-lg shadow-encre/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-signal ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <ArrowUp className="h-5 w-5" strokeWidth={2} />
    </button>
  );
}
