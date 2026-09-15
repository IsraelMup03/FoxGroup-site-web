import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import ImageProduit from './ImageProduit';
import Prix from './Prix';
import { usePanier } from '../context/PanierContext';

export default function CarteProduit({ produit }) {
  const { ajouter } = usePanier();
  const epuise = produit.stock === 0;

  return (
    <article className="panneau flex flex-col p-3">
      <Link to={`/produit/${produit.id}`} className="block overflow-hidden rounded-[20px]">
        <ImageProduit produit={produit} className="aspect-[4/3] w-full transition-transform duration-500 hover:scale-[1.03]" />
      </Link>
      <div className="flex flex-1 flex-col px-2 pb-1 pt-4">
        <p className="text-sm text-gris">{produit.type === 'application' ? 'Application' : 'Article'}</p>
        <Link to={`/produit/${produit.id}`} className="mt-0.5 text-lg font-normal leading-snug hover:underline">
          {produit.nom}
        </Link>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <Prix usd={produit.prix_usd} />
          <button
            type="button"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ardoise text-white transition-colors hover:bg-signal disabled:opacity-40 disabled:hover:bg-ardoise"
            onClick={() => ajouter(produit)}
            disabled={epuise}
            aria-label={epuise ? `${produit.nom} en rupture de stock` : `Ajouter ${produit.nom} au panier`}
            title={epuise ? 'Rupture de stock' : 'Ajouter au panier'}
          >
            <Plus className="h-5 w-5" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </article>
  );
}
