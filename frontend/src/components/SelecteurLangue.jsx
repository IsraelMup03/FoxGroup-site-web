import { LANGUES } from '../i18n/traductions';
import { useLangue } from '../context/LangueContext';

export default function SelecteurLangue({ surImage = false }) {
  const { langue, definirLangue, t } = useLangue();

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-full p-0.5 text-xs font-medium ${
        surImage ? 'bg-white/10' : 'bg-brume'
      }`}
      role="group"
      aria-label={t.commun.choisirLangue}
    >
      {LANGUES.map(({ code, libelle }) => (
        <button
          key={code}
          type="button"
          onClick={() => definirLangue(code)}
          aria-pressed={langue === code}
          title={libelle}
          className={`rounded-full px-2.5 py-1.5 uppercase tracking-wide transition-colors ${
            langue === code
              ? surImage
                ? 'bg-white text-encre'
                : 'bg-encre text-white'
              : surImage
                ? 'text-white/60 hover:text-white'
                : 'text-gris hover:text-encre'
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
