import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Minus, Plus } from 'lucide-react';
import Cadre from '../components/Cadre';
import ImageProduit from '../components/ImageProduit';
import Prix from '../components/Prix';
import { Chargement, Erreur } from '../components/Etat';
import { api } from '../lib/api';
import { usePanier } from '../context/PanierContext';

export default function Produit() {
  const { id } = useParams();
  const { ajouter } = usePanier();
  const [produit, setProduit] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [quantite, setQuantite] = useState(1);
  const [ajoute, setAjoute] = useState(false);

  useEffect(() => {
    setProduit(null);
    setErreur(null);
    api(`/api/produits/${id}`).then(setProduit).catch((e) => setErreur(e.message));
  }, [id]);

  const max = produit?.stock ?? 100;
  const epuise = produit?.stock === 0;

  const ajouterAuPanier = () => {
    ajouter(produit, quantite);
    setAjoute(true);
    setTimeout(() => setAjoute(false), 2200);
  };

  return (
    <Cadre>
      <Link to="/catalogue" className="ml-2 inline-flex items-center gap-2 text-gris hover:text-encre">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.6} /> Catalogue
      </Link>

      <div className="mt-4">
        {erreur && <Erreur message={erreur} />}
        {!produit && !erreur && <Chargement />}
        {produit && (
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="panneau p-3">
              <ImageProduit produit={produit} className="aspect-square w-full rounded-[20px]" />
            </div>

            <div className="panneau flex flex-col p-6 sm:p-10">
              <p className="text-gris">{produit.type === 'application' ? 'Application' : 'Article'}</p>
              <h1 className="mt-1 text-4xl font-normal leading-tight tracking-tight sm:text-5xl">{produit.nom}</h1>

              <Prix usd={produit.prix_usd} taille="grand" className="mt-8" />

              {produit.description && (
                <p className="mt-8 max-w-prose whitespace-pre-line leading-relaxed text-encre/85">{produit.description}</p>
              )}

              <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-trait pt-6 text-sm">
                <div>
                  <dt className="text-gris">Paiement</dt>
                  <dd className="mt-1 font-normal">À la livraison</dd>
                </div>
                <div>
                  <dt className="text-gris">{produit.type === 'application' ? 'Livraison' : 'Disponibilité'}</dt>
                  <dd className="mt-1 font-normal">
                    {produit.type === 'application'
                      ? 'Au rendez-vous choisi'
                      : produit.stock === null ? 'Disponible' : epuise ? 'Rupture de stock' : `${produit.stock} en stock`}
                  </dd>
                </div>
              </dl>

              <div className="mt-auto flex flex-wrap items-center gap-3 pt-10">
                <div className="flex items-center rounded-full border border-trait bg-white/70">
                  <button type="button" className="grid h-11 w-11 place-items-center disabled:opacity-30"
                    onClick={() => setQuantite((q) => Math.max(1, q - 1))} disabled={quantite <= 1 || epuise} aria-label="Diminuer la quantité">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center tabular-nums" aria-live="polite">{quantite}</span>
                  <button type="button" className="grid h-11 w-11 place-items-center disabled:opacity-30"
                    onClick={() => setQuantite((q) => Math.min(max, q + 1))} disabled={quantite >= max || epuise} aria-label="Augmenter la quantité">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button type="button" className="btn btn-signal px-7 py-3" onClick={ajouterAuPanier} disabled={epuise}>
                  {ajoute ? <><Check className="h-4 w-4" /> Ajouté au panier</> : 'Ajouter au panier'}
                </button>
                {ajoute && <Link to="/panier" className="btn btn-clair py-3">Voir le panier</Link>}
              </div>
            </div>
          </div>
        )}
      </div>
    </Cadre>
  );
}
