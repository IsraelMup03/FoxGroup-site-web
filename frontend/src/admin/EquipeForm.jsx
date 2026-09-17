import { useEffect, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { useLangue } from '../context/LangueContext';

export default function EquipeForm({ membre, onFermer, onEnregistre }) {
  const { appel } = useAuth();
  const { t } = useLangue();
  const tx = t.admin.equipeForm;
  const edition = Boolean(membre);

  const [form, setForm] = useState({
    nom: membre?.nom || '',
    role: membre?.role || '',
    bio: membre?.bio || '',
    ordre: membre?.ordre ?? 0,
    actif: membre?.actif ?? true,
  });
  const [fichier, setFichier] = useState(null);
  const [apercu, setApercu] = useState(membre?.photo_url || null);
  const [retirerPhoto, setRetirerPhoto] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => () => {
    if (apercu?.startsWith('blob:')) URL.revokeObjectURL(apercu);
  }, [apercu]);

  const maj = (champ) => (e) =>
    setForm((f) => ({ ...f, [champ]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const choisirPhoto = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setErreur(tx.erreurTailleImage);
      return;
    }
    setErreur(null);
    setFichier(f);
    setRetirerPhoto(false);
    setApercu(URL.createObjectURL(f));
  };

  const envoyer = async (e) => {
    e.preventDefault();
    setErreur(null);
    setEnvoi(true);
    const donnees = new FormData();
    Object.entries(form).forEach(([cle, valeur]) => donnees.append(cle, String(valeur)));
    if (fichier) donnees.append('photo', fichier);
    if (retirerPhoto) donnees.append('retirer_photo', 'true');

    try {
      const resultat = await appel(edition ? `/api/admin/equipe/${membre.id}` : '/api/admin/equipe', {
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
      <form onSubmit={envoyer} className="grid gap-5 md:grid-cols-[180px_1fr]">
        <div>
          <label className="group relative block aspect-square cursor-pointer overflow-hidden rounded-[22px] border border-dashed border-acier bg-white/60">
            {apercu ? (
              <img src={apercu} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full flex-col items-center justify-center gap-2 text-sm text-gris">
                <ImagePlus className="h-8 w-8" strokeWidth={1.2} /> {tx.photo}
              </span>
            )}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={choisirPhoto} className="sr-only" />
          </label>
          <p className="mt-2 text-xs text-gris">{tx.photoAide}</p>
          {apercu && (
            <button type="button" className="mt-2 text-sm text-signal-fonce hover:underline"
              onClick={() => { setApercu(null); setFichier(null); setRetirerPhoto(edition); }}>
              {tx.retirerPhoto}
            </button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="libelle">{tx.nom}</span>
            <input className="champ" value={form.nom} onChange={maj('nom')} required minLength={2} />
          </label>
          <label>
            <span className="libelle">{tx.role}</span>
            <input className="champ" value={form.role} onChange={maj('role')} required minLength={2} placeholder={tx.rolePlaceholder} />
          </label>

          <label className="sm:col-span-2">
            <span className="libelle">{tx.bio}</span>
            <textarea className="champ min-h-28 resize-y" value={form.bio} onChange={maj('bio')} maxLength={2000} />
          </label>

          <label>
            <span className="libelle">{tx.ordre}</span>
            <input className="champ" type="number" step="1" value={form.ordre} onChange={maj('ordre')} />
            <span className="mt-1 block text-xs text-gris">{tx.ordreAide}</span>
          </label>
          <label className="flex items-end gap-3 pb-2">
            <input type="checkbox" checked={form.actif} onChange={maj('actif')} className="h-5 w-5 accent-signal" />
            {tx.visible}
          </label>

          {erreur && <p className="text-sm text-signal-fonce sm:col-span-2" role="alert">{erreur}</p>}

          <div className="flex justify-end gap-2 sm:col-span-2">
            <button type="button" className="btn btn-clair" onClick={onFermer}>{tx.annuler}</button>
            <button type="submit" className="btn btn-signal" disabled={envoi}>
              {envoi ? tx.enregistrement : edition ? tx.enregistrer : tx.ajouter}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
