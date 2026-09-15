import { Link, Navigate, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import Cadre from '../components/Cadre';
import { SITE } from '../config/site';
import { CRENEAUX, formatCDF, formatDate, formatUSD } from '../lib/format';

export default function Confirmation() {
  const { state } = useLocation();
  if (!state?.commande) return <Navigate to="/" replace />;
  const { commande, nom } = state;

  return (
    <Cadre>
      <div className="mx-auto max-w-2xl">
        <section className="panneau p-6 sm:p-10">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-citron text-encre">
            <Check className="h-6 w-6" strokeWidth={2} />
          </span>
          <h1 className="mt-6 text-4xl font-normal tracking-tight">Commande enregistrée</h1>
          <p className="mt-3 text-gris">
            Merci {nom}. Nous vous contactons pour confirmer le rendez-vous. Gardez cette référence.
          </p>

          <p className="chiffre mt-8 text-[40px] sm:text-5xl">{commande.reference}</p>

          <dl className="mt-8 grid gap-5 border-t border-trait pt-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-gris">Rendez-vous</dt>
              <dd className="mt-1 font-normal first-letter:uppercase">
                {formatDate(commande.date_rendez_vous)}, {CRENEAUX[commande.creneau]?.toLowerCase()}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gris">À payer à la livraison</dt>
              <dd className="mt-1 font-normal">{formatUSD(commande.total_usd)}, soit {formatCDF(commande.total_cdf)}</dd>
            </div>
          </dl>

          <ul className="mt-6 divide-y divide-trait border-t border-trait">
            {commande.articles.map((a) => (
              <li key={a.nom} className="flex justify-between gap-4 py-3 text-sm">
                <span>{a.quantite} × {a.nom}</span>
                <span className="tabular-nums">{formatUSD(a.prix_unitaire_usd * a.quantite)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <a className="btn btn-sombre" target="_blank" rel="noreferrer"
              href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Bonjour FoxGroup, je viens de passer la commande ${commande.reference}.`)}`}>
              Nous écrire sur WhatsApp
            </a>
            <Link to="/catalogue" className="btn btn-clair">Retour au catalogue</Link>
          </div>
        </section>
      </div>
    </Cadre>
  );
}
