import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import Cadre from '../components/Cadre';
import CarteProduit from '../components/CarteProduit';
import { Chargement, Erreur, Vide } from '../components/Etat';
import { api } from '../lib/api';

const FILTRES = [
  { valeur: '', libelle: 'Tout' },
  { valeur: 'application', libelle: 'Applications' },
  { valeur: 'article', libelle: 'Articles' },
];

export default function Catalogue() {
  const [params, setParams] = useSearchParams();
  const type = params.get('type') || '';
  const [recherche, setRecherche] = useState(params.get('q') || '');
  const [produits, setProduits] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [essai, setEssai] = useState(0);

  useEffect(() => {
    let annule = false;
    const minuterie = setTimeout(() => {
      const qs = new URLSearchParams();
      if (type) qs.set('type', type);
      if (recherche.trim()) qs.set('q', recherche.trim());
      setErreur(null);
      api(`/api/produits?${qs}`)
        .then((d) => !annule && setProduits(d))
        .catch((e) => !annule && setErreur(e.message));
    }, 250);
    return () => {
      annule = true;
      clearTimeout(minuterie);
    };
  }, [type, recherche, essai]);

  const choisirType = (valeur) => {
    const suivant = new URLSearchParams(params);
    if (valeur) suivant.set('type', valeur);
    else suivant.delete('type');
    setParams(suivant, { replace: true });
  };

  return (
    <Cadre>
      <div className="flex flex-col gap-5 px-2 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-4xl font-normal tracking-tight sm:text-5xl">Catalogue</h1>
        <label className="relative w-full sm:w-80">
          <span className="sr-only">Rechercher un produit</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gris" strokeWidth={1.6} />
          <input type="search" value={recherche} onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher un produit" className="champ rounded-full pl-11" />
        </label>
      </div>

      <div className="mt-6 flex gap-2 px-2" role="tablist" aria-label="Type de produit">
        {FILTRES.map((f) => (
          <button key={f.valeur} type="button" role="tab" aria-selected={type === f.valeur}
            onClick={() => choisirType(f.valeur)}
            className={`btn ${type === f.valeur ? 'btn-sombre' : 'btn-clair'}`}>
            {f.libelle}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {erreur && <Erreur message={erreur} onReessayer={() => setEssai((n) => n + 1)} />}
        {!produits && !erreur && <Chargement />}
        {produits && produits.length === 0 && (
          <Vide titre="Aucun produit trouvé"
            texte={recherche ? 'Essayez un autre mot, ou retirez le filtre.' : 'Cette catégorie est encore vide.'} />
        )}
        {produits && produits.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {produits.map((p) => <CarteProduit key={p.id} produit={p} />)}
          </div>
        )}
      </div>
    </Cadre>
  );
}
