import { useEffect, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { useLangue } from '../context/LangueContext';

export default function SolutionForm({ solution, onFermer, onEnregistre }) {
  const { appel } = useAuth();
  const { t } = useLangue();
  const tx = t.admin.solutionForm;
  const edition = Boolean(solution);

  const [form, setForm] = useState({
    titre: solution?.titre || '',
    description_courte: solution?.description_courte || '',
    description: solution?.description || '',
    probleme_resolu: solution?.probleme_resolu || '',
    ordre: solution?.ordre ?? 0,
    en_vedette: solution?.en_vedette || false,
    actif: solution?.actif ?? true,
  });
  const [fichier, setFichier] = useState(null);
  const [apercu, setApercu] = useState(solution?.image_url || null);
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
      setErreur(tx.erreurTailleImage);
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
      const resultat = await appel(edition ? `/api/admin/solutions/${solution.id}` : '/api/admin/solutions', {
        methode: edition ? 'PUT' : 'POST',
        formulaire: donnees,
      });
      onEnregistre(resultat);
    } catch (err) {
      setErreur(err.message);
      setEnvoi(false);
    }
  };

  return (
    <Modal titre={edition ? tx.modifierTitre : tx.ajouterTitre} onFermer={onFermer} large>
      <form onSubmit={envoyer} className="grid gap-5 md:grid-cols-[220px_1fr]">
        <div>
          <label className="group relative block aspect-square cursor-pointer overflow-hidden rounded-[22px] border border-dashed border-acier bg-white/60">
            {apercu ? (
              <img src={apercu} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full flex-col items-center justify-center gap-2 text-sm text-gris">
                <ImagePlus className="h-8 w-8" strokeWidth={1.2} /> {tx.image}
              </span>
            )}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={choisirImage} className="sr-only" />
          </label>
          <p className="mt-2 text-xs text-gris">{tx.imageAide}</p>
          {apercu && (
            <button type="button" className="mt-2 text-sm text-signal-fonce hover:underline"
              onClick={() => { setApercu(null); setFichier(null); setRetirerImage(edition); }}>
              {tx.retirerImage}
            </button>
          )}
        </div>

        <div className="grid gap-4">
          <label>
            <span className="libelle">{tx.titreChamp}</span>
            <input className="champ" value={form.titre} onChange={maj('titre')} required minLength={2} placeholder={tx.titrePlaceholder} />
          </label>

          <label>
            <span className="libelle">{tx.descriptionCourte}</span>
            <input className="champ" value={form.description_courte} onChange={maj('description_courte')} maxLength={300} />
          </label>

          <label>
            <span className="libelle">{tx.descriptionComplete}</span>
            <textarea className="champ min-h-32 resize-y" value={form.description} onChange={maj('description')} maxLength={5000} />
          </label>

          <label>
            <span className="libelle">{tx.probleme}</span>
            <textarea className="champ min-h-24 resize-y" value={form.probleme_resolu} onChange={maj('probleme_resolu')} maxLength={3000}
              placeholder={tx.problemePlaceholder} />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="libelle">{tx.ordre}</span>
              <input className="champ" type="number" step="1" value={form.ordre} onChange={maj('ordre')} />
            </label>
            <div className="flex flex-col justify-end gap-2 pb-2">
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={form.en_vedette} onChange={maj('en_vedette')} className="h-5 w-5 accent-signal" />
                {tx.mettreEnAvant}
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={form.actif} onChange={maj('actif')} className="h-5 w-5 accent-signal" />
                {tx.visible}
              </label>
            </div>
          </div>

          {erreur && <p className="text-sm text-signal-fonce" role="alert">{erreur}</p>}

          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-clair" onClick={onFermer}>{tx.annuler}</button>
            <button type="submit" className="btn btn-signal" disabled={envoi}>
              {envoi ? tx.enregistrement : edition ? tx.enregistrer : tx.publier}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
