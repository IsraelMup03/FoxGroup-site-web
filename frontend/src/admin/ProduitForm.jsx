import { useEffect, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { useTaux } from '../context/TauxContext';
import { formatCDF } from '../lib/format';

export default function ProduitForm({ produit, onFermer, onEnregistre }) {
  const { appel } = useAuth();
  const { enCDF } = useTaux();
  const edition = Boolean(produit);

  const [form, setForm] = useState({
    type: produit?.type || 'application',
    nom: produit?.nom || '',
    description: produit?.description || '',
    prix_usd: produit?.prix_usd ?? '',
    stock: produit?.stock ?? '',
    en_vedette: produit?.en_vedette || false,
    actif: produit?.actif ?? true,
  });
  const [fichier, setFichier] = useState(null);
  const [apercu, setApercu] = useState(produit?.image_url || null);
  const [retirerImage, setRetirerImage] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => () => {
    if (apercu?.startsWith('blob:')) URL.revokeObjectURL(apercu);
  }, [apercu]);

  const maj = (champ) => (e) =>
    setForm((f) => ({ ...f, [champ]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const choisirImage = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setErreur("L'image dépasse 5 Mo.");
      return;
    }
    setErreur(null);
    setFichier(f);
    setRetirerImage(false);
    setApercu(URL.createObjectURL(f));
  };

  const envoyer = async (e) => {
    e.preventDefault();
    setErreur(null);
    setEnvoi(true);
    const donnees = new FormData();
    Object.entries(form).forEach(([cle, valeur]) => donnees.append(cle, String(valeur)));
    if (fichier) donnees.append('image', fichier);
    if (retirerImage) donnees.append('retirer_image', 'true');

    try {
      const resultat = await appel(edition ? `/api/admin/produits/${produit.id}` : '/api/admin/produits', {
        methode: edition ? 'PUT' : 'POST',
        formulaire: donnees,
      });
      onEnregistre(resultat);
    } catch (err) {
      setErreur(err.message);
      setEnvoi(false);
    }
  };

  const cdf = form.prix_usd !== '' ? enCDF(Number(String(form.prix_usd).replace(',', '.'))) : null;

  return (
    <Modal titre={edition ? 'Modifier le produit' : 'Ajouter un produit'} onFermer={onFermer} large>
      <form onSubmit={envoyer} className="grid gap-5 md:grid-cols-[220px_1fr]">
        <div>
          <label className="group relative block aspect-square cursor-pointer overflow-hidden rounded-[22px] border border-dashed border-acier bg-white/60">
            {apercu ? (
              <img src={apercu} alt="Aperçu" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full flex-col items-center justify-center gap-2 text-sm text-gris">
                <ImagePlus className="h-8 w-8" strokeWidth={1.2} /> Ajouter une image
              </span>
            )}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={choisirImage} className="sr-only" />
          </label>
          <p className="mt-2 text-xs text-gris">JPG, PNG ou WebP, 5 Mo maximum.</p>
          {apercu && (
            <button type="button" className="mt-2 text-sm text-signal-fonce hover:underline"
              onClick={() => { setApercu(null); setFichier(null); setRetirerImage(edition); }}>
              Retirer l’image
            </button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <fieldset className="sm:col-span-2">
            <legend className="libelle">Type</legend>
            <div className="flex gap-2">
              {[['application', 'Application'], ['article', 'Article']].map(([valeur, libelle]) => (
                <label key={valeur} className={`btn cursor-pointer ${form.type === valeur ? 'btn-sombre' : 'btn-clair'}`}>
                  <input type="radio" name="type" value={valeur} checked={form.type === valeur} onChange={maj('type')} className="sr-only" />
                  {libelle}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="sm:col-span-2">
            <span className="libelle">Nom</span>
            <input className="champ" value={form.nom} onChange={maj('nom')} required minLength={2} />
          </label>

          <label>
            <span className="libelle">Prix en dollars</span>
            <input className="champ" type="number" min="0" step="0.01" value={form.prix_usd} onChange={maj('prix_usd')} required />
            <span className="mt-1 block text-xs text-gris">{cdf ? `soit ${formatCDF(cdf)} au taux actuel` : '\u00a0'}</span>
          </label>

          {form.type === 'article' && (
            <label>
              <span className="libelle">Stock</span>
              <input className="champ" type="number" min="0" step="1" value={form.stock} onChange={maj('stock')} placeholder="Vide = illimité" />
            </label>
          )}

          <label className="sm:col-span-2">
            <span className="libelle">Description</span>
            <textarea className="champ min-h-32 resize-y" value={form.description} onChange={maj('description')} maxLength={5000} />
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" checked={form.en_vedette} onChange={maj('en_vedette')} className="h-5 w-5 accent-signal" />
            Mettre à la une
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={form.actif} onChange={maj('actif')} className="h-5 w-5 accent-signal" />
            Visible sur le site
          </label>

          {erreur && <p className="text-sm text-signal-fonce sm:col-span-2" role="alert">{erreur}</p>}

          <div className="flex justify-end gap-2 sm:col-span-2">
            <button type="button" className="btn btn-clair" onClick={onFermer}>Annuler</button>
            <button type="submit" className="btn btn-signal" disabled={envoi}>
              {envoi ? 'Enregistrement…' : edition ? 'Enregistrer les modifications' : 'Publier le produit'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
