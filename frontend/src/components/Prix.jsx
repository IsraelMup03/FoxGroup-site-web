import { useTaux } from '../context/TauxContext';
import { formatCDF, formatUSD } from '../lib/format';

export default function Prix({ usd, taille = 'normal', className = '' }) {
  const { enCDF } = useTaux();
  const cdf = enCDF(usd);
  const grand = taille === 'grand';

  return (
    <div className={className}>
      <p className={`chiffre ${grand ? 'text-5xl' : 'text-[28px]'}`}>{formatUSD(usd)}</p>
      <p className={`mt-1.5 text-gris ${grand ? 'text-base' : 'text-sm'}`}>
        {cdf === null ? 'Conversion en francs indisponible' : `soit ${formatCDF(cdf)}`}
      </p>
    </div>
  );
}
