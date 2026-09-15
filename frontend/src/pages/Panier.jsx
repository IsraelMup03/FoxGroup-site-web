import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Cadre from '../components/Cadre';
import ImageProduit from '../components/ImageProduit';
import { Vide } from '../components/Etat';
import { usePanier } from '../context/PanierContext';
import { useTaux } from '../context/TauxContext';
import { api } from '../lib/api';
import { aujourdhui, CRENEAUX, formatCDF, formatUSD } from '../lib/format';

const VIDE = { nom: '', telephone: '', email: '', adresse: '', date_rendez_vous: '', creneau: 'indifferent', note: '' };

export default function Panier() {
  const { lignes, changerQuantite, retirer, vider, totalUsd } = usePanier();
  const { enCDF, taux } = useTaux();
  const navigate = useNavigate();
  const [form, setForm] = useState(VIDE);
  const [erreur, setErreur] = useState(null);
  const [envoi, setEnvoi] = useState(false);

  const maj = (champ) => (e) => setForm((f) => ({ ...f, [champ]: e.target.value }));
  const contientApplication = lignes.some((l) => l.type === 'application');

  const envoyer = async (e) => {
    e.preventDefault();
    setErreur(null);
    if (!form.telephone.trim() && !form.email.trim()) {
      setErreur('Indiquez un numéro de téléphone ou une adresse email pour que nous puissions vous joindre.');
      return;
    }
    setEnvoi(true);
    try {
      const commande = await api('/api/commandes', {
        methode: 'POST',
        corps: { ...form, articles: lignes.map((l) => ({ produit_id: l.id, quantite: l.quantite })) },
      });
      vider();
      navigate('/confirmation', { state: { commande, nom: form.nom } });
    } catch (err) {
      setErreur(err.message);
      setEnvoi(false);
    }
  };

  if (!lignes.length) {
    return (
      <Cadre>
        <Vide titre="Votre panier est vide" texte="Parcourez le catalogue et ajoutez les produits qui vous intéressent."
          action={<Link to="/catalogue" className="btn btn-signal">Voir le catalogue</Link>} />
      </Cadre>
    );
  }

  return (
    <Cadre>
      <h1 className="px-2 text-4xl font-normal tracking-tight sm:text-5xl">Votre commande</h1>

      <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_1.1fr]">
        {/* Récapitulatif */}
        <section className="panneau h-fit p-4 sm:p-6" aria-labelledby="titre-panier">
          <h2 id="titre-panier" className="px-2 text-[17px] font-normal">Panier</h2>
          <ul className="mt-3 divide-y divide-trait">
            {lignes.map((l) => (
              <li key={l.id} className="flex gap-4 px-2 py-4">
                <ImageProduit produit={l} className="h-20 w-20 shrink-0 rounded-2xl" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <Link to={`/produit/${l.id}`} className="font-normal leading-snug hover:underline">{l.nom}</Link>
                    <button type="button" onClick={() => retirer(l.id)} className="text-gris hover:text-signal" aria-label={`Retirer ${l.nom}`}>
                      <Trash2 className="h-4 w-4" strokeWidth={1.6} />
                    </button>
                  </div>
                  <p className="text-sm text-gris">{formatUSD(l.prix_usd)} l’unité</p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center rounded-full border border-trait bg-white/70">
                      <button type="button" className="grid h-9 w-9 place-items-center disabled:opacity-30"
                        onClick={() => changerQuantite(l.id, l.quantite - 1)} disabled={l.quantite <= 1} aria-label="Diminuer">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-7 text-center text-sm tabular-nums">{l.quantite}</span>
                      <button type="button" className="grid h-9 w-9 place-items-center disabled:opacity-30"
                        onClick={() => changerQuantite(l.id, l.quantite + 1)}
                        disabled={l.stock !== null && l.stock !== undefined && l.quantite >= l.stock} aria-label="Augmenter">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="tabular-nums">{formatUSD(l.prix_usd * l.quantite)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-2 rounded-[22px] bg-white/70 p-5">
            <div className="flex items-end justify-between gap-4">
              <p className="text-gris">Total à payer à la livraison</p>
              <p className="chiffre text-4xl">{formatUSD(totalUsd)}</p>
            </div>
            <p className="mt-2 text-right text-sm text-gris">
              {taux ? `soit ${formatCDF(enCDF(totalUsd))}` : 'Conversion en francs indisponible'}
            </p>
          </div>
          <p className="mt-3 px-2 text-sm text-gris">
            Le montant en francs est calculé au taux du moment de la commande.
          </p>
        </section>

        {/* Formulaire */}
        <form onSubmit={envoyer} className="panneau p-6 sm:p-8" noValidate={false}>
          <h2 className="text-[17px] font-normal">Vos coordonnées et le rendez-vous</h2>
          <p className="mt-1 text-sm text-gris">Aucun compte à créer. Nous vous contactons pour confirmer.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="libelle">Nom complet</span>
              <input className="champ" value={form.nom} onChange={maj('nom')} required minLength={2} autoComplete="name" />
            </label>
            <label>
              <span className="libelle">Téléphone</span>
              <input className="champ" type="tel" value={form.telephone} onChange={maj('telephone')}
                placeholder="+243 …" autoComplete="tel" />
            </label>
            <label>
              <span className="libelle">Email</span>
              <input className="champ" type="email" value={form.email} onChange={maj('email')} autoComplete="email" />
            </label>
            <p className="-mt-2 text-sm text-gris sm:col-span-2">Le téléphone ou l’email suffit.</p>

            <label className="sm:col-span-2">
              <span className="libelle">Adresse précise</span>
              <textarea className="champ min-h-24 resize-y" value={form.adresse} onChange={maj('adresse')} required minLength={10}
                placeholder="Commune, quartier, avenue, numéro et un repère proche" autoComplete="street-address" />
            </label>

            <label>
              <span className="libelle">{contientApplication ? 'Jour du rendez-vous' : 'Jour de livraison'}</span>
              <input className="champ" type="date" min={aujourdhui()} value={form.date_rendez_vous}
                onChange={maj('date_rendez_vous')} required />
            </label>
            <label>
              <span className="libelle">Moment de la journée</span>
              <select className="champ" value={form.creneau} onChange={maj('creneau')}>
                {Object.entries(CRENEAUX).map(([valeur, libelle]) => (
                  <option key={valeur} value={valeur}>{libelle}</option>
                ))}
              </select>
            </label>

            <label className="sm:col-span-2">
              <span className="libelle">Précision (facultatif)</span>
              <textarea className="champ min-h-20 resize-y" value={form.note} onChange={maj('note')} maxLength={1000}
                placeholder="Heure préférée, besoin particulier…" />
            </label>
          </div>

          {erreur && (
            <p className="mt-5 rounded-2xl border border-signal/30 bg-signal/5 px-4 py-3 text-sm text-signal-fonce" role="alert">
              {erreur}
            </p>
          )}

          <button type="submit" className="btn btn-signal mt-6 w-full py-3.5 text-base" disabled={envoi}>
            {envoi ? 'Envoi de la commande…' : 'Confirmer la commande'}
          </button>
        </form>
      </div>
    </Cadre>
  );
}
