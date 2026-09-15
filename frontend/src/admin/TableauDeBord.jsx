import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Chargement, Erreur } from '../components/Etat';
import Statut from './Statut';
import { CRENEAUX, formatDate, formatUSD } from '../lib/format';

export default function TableauDeBord() {
  const { appel, admin } = useAuth();
  const [stats, setStats] = useState(null);
  const [erreur, setErreur] = useState(null);

  const charger = useCallback(() => {
    setErreur(null);
    appel('/api/admin/stats').then(setStats).catch((e) => setErreur(e.message));
  }, [appel]);
  useEffect(charger, [charger]);

  if (erreur) return <Erreur message={erreur} onReessayer={charger} />;
  if (!stats) return <Chargement />;

  const cartes = [
    { titre: 'En attente', valeur: stats.en_attente, unite: 'commandes', lien: '/admin/commandes?statut=en_attente' },
    { titre: "Reçues aujourd'hui", valeur: stats.aujourdhui, unite: 'commandes', lien: '/admin/commandes' },
    { titre: 'Ventes livrées', valeur: formatUSD(stats.ventes_livrees_usd).replace(' $', ''), unite: '$', lien: '/admin/commandes?statut=livree' },
    { titre: 'Produits en ligne', valeur: stats.produits_actifs, unite: 'produits', lien: '/admin/produits' },
  ];

  return (
    <div>
      <h1 className="px-2 pb-5 pt-2 text-4xl font-normal tracking-tight">Bonjour{admin?.nom ? `, ${admin.nom}` : ''}</h1>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {cartes.map((c) => (
          <Link key={c.titre} to={c.lien} className="panneau flex flex-col p-6 hover:bg-white">
            <h2 className="text-[15px] font-normal text-gris">{c.titre}</h2>
            <p className="mt-8">
              <span className="chiffre text-5xl">{c.valeur}</span>
              <span className="ml-1.5 text-sm text-gris">{c.unite}</span>
            </p>
          </Link>
        ))}
      </div>

      <section className="panneau mt-3 p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-normal">Prochains rendez-vous</h2>
          <Link to="/admin/commandes" className="text-sm text-gris hover:text-encre">Toutes les commandes</Link>
        </div>
        {stats.rendez_vous.length === 0 ? (
          <p className="mt-6 text-gris">Aucun rendez-vous à venir.</p>
        ) : (
          <ul className="mt-4 divide-y divide-trait">
            {stats.rendez_vous.map((r) => (
              <li key={r.id} className="grid gap-2 py-4 sm:grid-cols-[180px_1fr_auto] sm:items-center sm:gap-6">
                <div>
                  <p className="font-normal first-letter:uppercase">{formatDate(r.date_rendez_vous, { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                  <p className="text-sm text-gris">{CRENEAUX[r.creneau]}</p>
                </div>
                <div className="min-w-0">
                  <p className="font-normal">{r.client_nom} <span className="text-sm text-gris">{r.reference}</span></p>
                  <p className="truncate text-sm text-gris">{r.adresse}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="tabular-nums">{formatUSD(r.total_usd)}</span>
                  <Statut statut={r.statut} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
