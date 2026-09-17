import { Loader2 } from 'lucide-react';
import { useLangue } from '../context/LangueContext';

export function Chargement({ texte }) {
  const { t } = useLangue();
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-gris" role="status">
      <Loader2 className="h-5 w-5 animate-spin" strokeWidth={1.6} /> {texte || t.commun.chargement}
    </div>
  );
}

export function Erreur({ message, onReessayer }) {
  const { t } = useLangue();
  return (
    <div className="panneau flex flex-col items-start gap-4 p-6" role="alert">
      <p className="text-encre">{message}</p>
      {onReessayer && (
        <button type="button" className="btn btn-clair" onClick={onReessayer}>{t.commun.reessayer}</button>
      )}
    </div>
  );
}

export function Vide({ titre, texte, action }) {
  return (
    <div className="panneau flex flex-col items-center gap-3 px-6 py-14 text-center">
      <p className="text-xl font-normal">{titre}</p>
      {texte && <p className="max-w-md text-gris">{texte}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
