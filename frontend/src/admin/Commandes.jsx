import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, Mail, MessageCircle, Phone, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Chargement, Erreur, Vide } from '../components/Etat';
import Statut, { STATUTS } from './Statut';
import { CRENEAUX, formatCDF, formatDate, formatDateHeure, formatUSD, lienWhatsApp } from '../lib/format';

function Commande({ commande, onStatut }) {
  const [ouverte, setOuverte] = useState(false);
  const [maj, setMaj] = useState(false);
  const [erreur, setErreur] = useState(null);

  const changer = async (statut) => {
    setErreur(null);
    setMaj(true);
    try {
      await onStatut(commande.id, statut);
    } catch (e) {
      setErreur(e.message);
    } finally {
      setMaj(false);
    }
  };

  return (
    <li className="panneau overflow-hidden">
      <button type="button" onClick={() => setOuverte((o) => !o)} aria-expanded={ouverte}
        className="grid w-full gap-2 p-5 text-left sm:grid-cols-[1.2fr_1fr_auto_auto] sm:items-center sm:gap-6">
        <div className="min-w-0">
          <p className="font-normal">{commande.client_nom}</p>
          <p className="text-sm text-gris">{commande.reference}, reçue le {formatDateHeure(commande.cree_le)}</p>
        </div>
        <div>
          <p className="font-normal first-letter:uppercase">
            {formatDate(commande.date_rendez_vous, { weekday: 'short', day: 'numeric', month: 'short' })}
          </p>
          <p className="text-sm text-gris">{CRENEAUX[commande.creneau]}</p>
        </div>
        <p className="tabular-nums">{formatUSD(commande.total_usd)}</p>
        <div className="flex items-center gap-3">
          <Statut statut={commande.statut} />
          <ChevronDown className={`h-4 w-4 text-gris transition-transform ${ouverte ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {ouverte && (
        <div className="grid gap-6 border-t border-trait p-5 lg:grid-cols-2">
          <div>
            <h3 className="text-sm text-gris">Client</h3>
            <p className="mt-2 whitespace-pre-line">{commande.adresse}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {commande.client_telephone && (
                <>
                  <a href={`tel:${commande.client_telephone.replace(/\s/g, '')}`} className="btn btn-clair py-2 text-sm">
                    <Phone className="h-4 w-4" strokeWidth={1.6} /> {commande.client_telephone}
                  </a>
                  <a href={lienWhatsApp(commande.client_telephone, `Bonjour ${commande.client_nom}, FoxGroup vous contacte au sujet de votre commande ${commande.reference}.`)}
                    target="_blank" rel="noreferrer" className="btn btn-clair py-2 text-sm">
                    <MessageCircle className="h-4 w-4" strokeWidth={1.6} /> WhatsApp
                  </a>
                </>
              )}
              {commande.client_email && (
                <a href={`mailto:${commande.client_email}?subject=${encodeURIComponent(`Commande ${commande.reference}`)}`} className="btn btn-clair py-2 text-sm">
                  <Mail className="h-4 w-4" strokeWidth={1.6} /> {commande.client_email}
                </a>
              )}
            </div>
            {commande.note && (
              <>
                <h3 className="mt-5 text-sm text-gris">Précision du client</h3>
                <p className="mt-1 whitespace-pre-line">{commande.note}</p>
              </>
            )}
          </div>

          <div>
            <h3 className="text-sm text-gris">Produits</h3>
            <ul className="mt-2 divide-y divide-trait">
              {commande.lignes.map((l, i) => (
                <li key={i} className="flex justify-between gap-4 py-2 text-sm">
                  <span>{l.quantite} × {l.nom_produit} <span className="text-gris">({l.type})</span></span>
                  <span className="tabular-nums">{formatUSD(l.prix_unitaire_usd * l.quantite)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 flex justify-between border-t border-trait pt-3">
              <span>Total</span>
              <span className="tabular-nums">{formatUSD(commande.total_usd)}, soit {formatCDF(commande.total_cdf)}</span>
            </p>
            <p className="mt-1 text-right text-xs text-gris">Taux enregistré : {formatCDF(commande.taux_cdf)} pour 1 $</p>

            <label className="mt-5 block">
              <span className="libelle">Statut</span>
              <select className="champ" value={commande.statut} onChange={(e) => changer(e.target.value)} disabled={maj}>
                {Object.entries(STATUTS).map(([valeur, s]) => <option key={valeur} value={valeur}>{s.libelle}</option>)}
              </select>
            </label>
            {erreur && <p className="mt-2 text-sm text-signal-fonce" role="alert">{erreur}</p>}
          </div>
        </div>
      )}
    </li>
  );
}

export default function Commandes() {
  const { appel } = useAuth();
  const [params, setParams] = useSearchParams();
  const statut = params.get('statut') || '';
  const [recherche, setRecherche] = useState('');
  const [commandes, setCommandes] = useState(null);
  const [erreur, setErreur] = useState(null);

  const charger = useCallback(() => {
    const qs = new URLSearchParams();
    if (statut) qs.set('statut', statut);
    if (recherche.trim()) qs.set('q', recherche.trim());
    setErreur(null);
    appel(`/api/admin/commandes?${qs}`).then(setCommandes).catch((e) => setErreur(e.message));
  }, [appel, statut, recherche]);

  useEffect(() => {
    const t = setTimeout(charger, 250);
    return () => clearTimeout(t);
  }, [charger]);

  const changerStatut = async (id, nouveau) => {
    await appel(`/api/admin/commandes/${id}/statut`, { methode: 'PATCH', corps: { statut: nouveau } });
    setCommandes((liste) => {
      const maj = liste.map((c) => (c.id === id ? { ...c, statut: nouveau } : c));
      return statut ? maj.filter((c) => c.statut === statut) : maj;
    });
  };

  const filtrer = (valeur) => {
    const suivant = new URLSearchParams(params);
    if (valeur) suivant.set('statut', valeur);
    else suivant.delete('statut');
    setParams(suivant, { replace: true });
  };

  return (
    <div>
      <div className="flex flex-col gap-4 px-2 pb-5 pt-2 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-4xl font-normal tracking-tight">Commandes</h1>
        <label className="relative w-full sm:w-80">
          <span className="sr-only">Rechercher une commande</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gris" strokeWidth={1.6} />
          <input type="search" className="champ rounded-full pl-11" placeholder="Référence, nom ou téléphone"
            value={recherche} onChange={(e) => setRecherche(e.target.value)} />
        </label>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 px-2">
        {[['', 'Toutes'], ...Object.entries(STATUTS).map(([v, s]) => [v, s.libelle])].map(([valeur, libelle]) => (
          <button key={valeur} type="button" onClick={() => filtrer(valeur)}
            className={`btn py-2 text-sm ${statut === valeur ? 'btn-sombre' : 'btn-clair'}`}>
            {libelle}
          </button>
        ))}
      </div>

      {erreur && <Erreur message={erreur} onReessayer={charger} />}
      {!commandes && !erreur && <Chargement />}
      {commandes && commandes.length === 0 && (
        <Vide titre="Aucune commande" texte="Les commandes passées sur le site apparaissent ici." />
      )}
      {commandes && commandes.length > 0 && (
        <ul className="space-y-3">
          {commandes.map((c) => <Commande key={c.id} commande={c} onStatut={changerStatut} />)}
        </ul>
      )}
    </div>
  );
}
