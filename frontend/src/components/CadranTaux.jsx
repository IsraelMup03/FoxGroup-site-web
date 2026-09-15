import { useTaux } from '../context/TauxContext';
import { formatCDF, formatHeure, formatNombre } from '../lib/format';

const SOURCES = {
  marche: 'Taux du marché',
  manuel: 'Taux fixé par FoxGroup',
  manuel_secours: 'Taux de secours',
};

// Cadran inspiré des jauges du design : graduations fines, arc signal, gros chiffre léger
export default function CadranTaux() {
  const { taux, source, mis_a_jour, chargement, erreur } = useTaux();
  const cx = 160;
  const cy = 160;
  const graduations = Array.from({ length: 72 }, (_, i) => {
    const angle = (i / 72) * Math.PI * 2 - Math.PI / 2;
    const longue = i % 6 === 0;
    const r1 = longue ? 122 : 126;
    const r2 = 132;
    return (
      <line key={i}
        x1={cx + r1 * Math.cos(angle)} y1={cy + r1 * Math.sin(angle)}
        x2={cx + r2 * Math.cos(angle)} y2={cy + r2 * Math.sin(angle)}
        stroke="currentColor" strokeOpacity={longue ? 0.55 : 0.22} strokeWidth={longue ? 1.4 : 1} />
    );
  });

  // Arc de 12 h à environ 4 h, point au bout
  const debut = -Math.PI / 2;
  const fin = debut + Math.PI * 0.66;
  const r = 108;
  const x2 = cx + r * Math.cos(fin);
  const y2 = cy + r * Math.sin(fin);

  return (
    <section className="panneau flex h-full flex-col p-6 sm:p-7" aria-labelledby="titre-taux">
      <h2 id="titre-taux" className="text-[17px] font-normal">Taux du jour</h2>

      <div className="relative mx-auto my-4 w-full max-w-[320px] flex-1 text-encre">
        <svg viewBox="0 0 320 320" className="w-full" aria-hidden="true">
          {graduations}
          <path d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${x2} ${y2}`} fill="none" stroke="var(--color-signal)" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx={x2} cy={y2} r="4.5" fill="var(--color-signal)" />
          <text x={cx} y="46" textAnchor="middle" fontSize="11" fill="var(--color-gris)">USD</text>
          <text x={cx} y="284" textAnchor="middle" fontSize="11" fill="var(--color-gris)">CDF</text>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-gris">1 dollar =</p>
          <p className="chiffre mt-2 text-[52px] sm:text-[58px]">
            {chargement ? '…' : taux ? formatNombre(taux) : '—'}
          </p>
          <p className="mt-2 text-sm text-gris">francs congolais</p>
        </div>
      </div>

      {erreur && !taux ? (
        <p className="text-sm text-gris">{erreur}</p>
      ) : (
        <dl className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <dt className="text-gris">10 $</dt>
            <dd className="mt-1 font-normal">{taux ? formatCDF(10 * taux) : '—'}</dd>
          </div>
          <div>
            <dt className="text-gris">100 $</dt>
            <dd className="mt-1 font-normal">{taux ? formatCDF(100 * taux) : '—'}</dd>
          </div>
          <div>
            <dt className="text-gris">{SOURCES[source] || 'Source'}</dt>
            <dd className="mt-1 font-normal">{mis_a_jour ? `vérifié à ${formatHeure(mis_a_jour)}` : '—'}</dd>
          </div>
        </dl>
      )}
    </section>
  );
}
