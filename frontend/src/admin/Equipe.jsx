import { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Chargement, Erreur, Vide } from '../components/Etat';
import Modal from '../components/Modal';
import EquipeForm from './EquipeForm';

export default function Equipe() {
  const { appel } = useAuth();
  const [membres, setMembres] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [edition, setEdition] = useState(undefined);
  const [aSupprimer, setASupprimer] = useState(null);
  const [suppression, setSuppression] = useState(false);

  const charger = useCallback(() => {
    setErreur(null);
    appel('/api/admin/equipe').then(setMembres).catch((e) => setErreur(e.message));
  }, [appel]);
  useEffect(charger, [charger]);

  const enregistre = (membre) => {
    setMembres((liste) => {
      const existe = liste.some((m) => m.id === membre.id);
      return existe ? liste.map((m) => (m.id === membre.id ? membre : m)) : [...liste, membre];
    });
    setEdition(undefined);
  };

  const supprimer = async () => {
    setSuppression(true);
    try {
      await appel(`/api/admin/equipe/${aSupprimer.id}`, { methode: 'DELETE' });
      setMembres((liste) => liste.filter((m) => m.id !== aSupprimer.id));
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
        <div>
          <h1 className="text-4xl font-normal tracking-tight">Équipe</h1>
          <p className="mt-1 text-gris">Les profils affichés dans la section « Notre équipe » du site.</p>
        </div>
        <button type="button" className="btn btn-signal" onClick={() => setEdition(null)}>
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      {erreur && <div className="mb-3"><Erreur message={erreur} onReessayer={charger} /></div>}
      {!membres && !erreur && <Chargement />}
      {membres && membres.length === 0 && (
        <Vide titre="Aucun membre" texte="Ajoutez les 5 profils de votre équipe."
          action={<button type="button" className="btn btn-signal" onClick={() => setEdition(null)}>Ajouter un membre</button>} />
      )}

      {membres && membres.length > 0 && (
        <ul className="panneau divide-y divide-trait p-2">
          {membres.map((m) => (
            <li key={m.id} className="flex items-center gap-4 p-3">
              {m.photo_url ? (
                <img src={m.photo_url} alt={m.nom} className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
              ) : (
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#C9D2E0] to-[#95A5C0] text-white">
                  <User className="h-7 w-7" strokeWidth={1.2} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-normal">{m.nom}</p>
                <p className="text-sm text-gris">{m.role}</p>
              </div>
              {!m.actif && <span className="rounded-md border border-trait px-2 py-0.5 text-xs text-gris">Masqué</span>}
              <div className="flex gap-1">
                <button type="button" onClick={() => setEdition(m)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white" aria-label={`Modifier ${m.nom}`}>
                  <Pencil className="h-4 w-4" strokeWidth={1.6} />
                </button>
                <button type="button" onClick={() => setASupprimer(m)} className="grid h-10 w-10 place-items-center rounded-full text-gris hover:bg-white hover:text-signal" aria-label={`Supprimer ${m.nom}`}>
                  <Trash2 className="h-4 w-4" strokeWidth={1.6} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {edition !== undefined && (
        <EquipeForm membre={edition} onFermer={() => setEdition(undefined)} onEnregistre={enregistre} />
      )}

      {aSupprimer && (
        <Modal titre="Supprimer ce membre ?" onFermer={() => setASupprimer(null)}>
          <p className="text-gris">« {aSupprimer.nom} » sera retiré du site.</p>
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
