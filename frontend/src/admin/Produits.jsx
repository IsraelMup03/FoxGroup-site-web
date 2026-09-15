import { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Chargement, Erreur, Vide } from '../components/Etat';
import ImageProduit from '../components/ImageProduit';
import Modal from '../components/Modal';
import ProduitForm from './ProduitForm';
import { formatUSD } from '../lib/format';

export default function Produits() {
  const { appel } = useAuth();
  const [produits, setProduits] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [edition, setEdition] = useState(undefined); // undefined = fermé, null = nouveau, objet = modification
  const [aSupprimer, setASupprimer] = useState(null);
  const [suppression, setSuppression] = useState(false);

  const charger = useCallback(() => {
    setErreur(null);
    appel('/api/admin/produits').then(setProduits).catch((e) => setErreur(e.message));
  }, [appel]);
  useEffect(charger, [charger]);

  const enregistre = (produit) => {
    setProduits((liste) => {
      const existe = liste.some((p) => p.id === produit.id);
      return existe ? liste.map((p) => (p.id === produit.id ? produit : p)) : [produit, ...liste];
    });
    setEdition(undefined);
  };

  const supprimer = async () => {
    setSuppression(true);
    try {
      await appel(`/api/admin/produits/${aSupprimer.id}`, { methode: 'DELETE' });
      setProduits((liste) => liste.filter((p) => p.id !== aSupprimer.id));
      setASupprimer(null);
    } catch (e) {
      setErreur(e.message);
      setASupprimer(null);
    } finally {
      setSuppression(false);
    }
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-4 px-2 pb-5 pt-2">
        <h1 className="text-4xl font-normal tracking-tight">Produits</h1>
        <button type="button" className="btn btn-signal" onClick={() => setEdition(null)}>
          <Plus className="h-4 w-4" /> Ajouter un produit
        </button>
      </div>

      {erreur && <div className="mb-3"><Erreur message={erreur} onReessayer={charger} /></div>}
      {!produits && !erreur && <Chargement />}
      {produits && produits.length === 0 && (
        <Vide titre="Aucun produit" texte="Publiez votre première application ou votre premier article."
          action={<button type="button" className="btn btn-signal" onClick={() => setEdition(null)}>Ajouter un produit</button>} />
      )}

      {produits && produits.length > 0 && (
        <ul className="panneau divide-y divide-trait p-2">
          {produits.map((p) => (
            <li key={p.id} className="flex items-center gap-4 p-3">
              <ImageProduit produit={p} className="h-16 w-16 shrink-0 rounded-2xl" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-normal">{p.nom}</p>
                <p className="text-sm text-gris">
                  {p.type === 'application' ? 'Application' : 'Article'}
                  {p.type === 'article' && `, stock : ${p.stock === null ? 'illimité' : p.stock}`}
                </p>
              </div>
              <div className="hidden flex-wrap justify-end gap-1.5 sm:flex">
                {p.en_vedette && <span className="rounded-md bg-citron px-2 py-0.5 text-xs font-medium">À la une</span>}
                {!p.actif && <span className="rounded-md border border-trait px-2 py-0.5 text-xs text-gris">Masqué</span>}
              </div>
              <p className="w-24 text-right tabular-nums">{formatUSD(p.prix_usd)}</p>
              <div className="flex gap-1">
                <button type="button" onClick={() => setEdition(p)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white" aria-label={`Modifier ${p.nom}`}>
                  <Pencil className="h-4 w-4" strokeWidth={1.6} />
                </button>
                <button type="button" onClick={() => setASupprimer(p)} className="grid h-10 w-10 place-items-center rounded-full text-gris hover:bg-white hover:text-signal" aria-label={`Supprimer ${p.nom}`}>
                  <Trash2 className="h-4 w-4" strokeWidth={1.6} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {edition !== undefined && (
        <ProduitForm produit={edition} onFermer={() => setEdition(undefined)} onEnregistre={enregistre} />
      )}

      {aSupprimer && (
        <Modal titre="Supprimer ce produit ?" onFermer={() => setASupprimer(null)}>
          <p className="text-gris">
            « {aSupprimer.nom} » sera retiré du site et son image supprimée. Les commandes déjà passées gardent son nom.
            Pour le cacher temporairement, décochez plutôt « Visible sur le site ».
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" className="btn btn-clair" onClick={() => setASupprimer(null)}>Annuler</button>
            <button type="button" className="btn btn-signal" onClick={supprimer} disabled={suppression}>
              {suppression ? 'Suppression…' : 'Supprimer'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
