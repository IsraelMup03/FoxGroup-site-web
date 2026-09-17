import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useLangue } from '../context/LangueContext';

export default function Modal({ titre, onFermer, children, large = false }) {
  const { t } = useLangue();
  useEffect(() => {
    const touche = (e) => e.key === 'Escape' && onFermer();
    document.addEventListener('keydown', touche);
    const ancien = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', touche);
      document.body.style.overflow = ancien;
    };
  }, [onFermer]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ardoise/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onFermer()}>
      <div role="dialog" aria-modal="true" aria-label={titre}
        className={`max-h-[92vh] w-full overflow-y-auto rounded-t-[28px] bg-verre p-6 sm:rounded-[28px] sm:p-8 ${large ? 'sm:max-w-3xl' : 'sm:max-w-lg'}`}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-normal">{titre}</h2>
          <button type="button" onClick={onFermer} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white" aria-label={t.commun.fermer}>
            <X className="h-5 w-5" strokeWidth={1.6} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
