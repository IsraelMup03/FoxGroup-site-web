import { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Chargement, Erreur, Vide } from '../components/Etat';
import Modal from '../components/Modal';
import SolutionForm from './SolutionForm';

export default function Solutions() {
  const { appel } = useAuth();
  const [solutions, setSolutions] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [edition, setEdition] = useState(undefined);
  const [aSupprimer, setASupprimer] = useState(null);
  const [suppression, setSuppression] = useState(false);

  const charger = useCallback(() => {
    setErreur(null);
    appel('/api/admin/solutions').then(setSolutions).catch((e) => setErreur(e.message));
  }, [appel]);
  useEffect(charger, [charger]);

  const enregistre = (solution) => {
    setSolutions((liste) => {
      const existe = liste.some((s) => s.id === solution.id);
      return existe ? liste.map((s) => (s.id === solution.id ? solution : s)) : [solution, ...liste];
    });
    setEdition(undefined);
  };

  const supprimer = async () => {
    setSuppression(true);
    try {
      await appel(`/api/admin/solutions/${aSupprimer.id}`, { methode: 'DELETE' });
      setSolutions((liste) => liste.filter((s) => s.id !== aSupprimer.id));
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
          <h1 className="text-4xl font-normal tracking-tight">Solutions</h1>
          <p className="mt-1 text-gris">Les projets affichés dans la section « Nos solutions » du site.</p>
        </div>
        <button type="button" className="btn btn-signal" onClick={() => setEdition(null)}>
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      {erreur && <div className="mb-3"><Erreur message={erreur} onReessayer={charger} /></div>}
      {!solutions && !erreur && <Chargement />}
      {solutions && solutions.length === 0 && (
        <Vide titre="Aucune solution" texte="Publiez votre première réalisation."
          action={<button type="button" className="btn btn-signal" onClick={() => setEdition(null)}>Ajouter une solution</button>} />
      )}

      {solutions && solutions.length > 0 && (
        <ul className="panneau divide-y divide-trait p-2">
          {solutions.map((s) => (
            <li key={s.id} className="flex items-center gap-4 p-3">
              {s.image_url ? (
                <img src={s.image_url} alt={s.titre} className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
              ) : (
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#C9D2E0] to-[#95A5C0] text-white">
                  <Sparkles className="h-7 w-7" strokeWidth={1.2} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-normal">{s.titre}</p>
                <p className="truncate text-sm text-gris">{s.description_courte || s.description}</p>
              </div>
              <div className="hidden flex-wrap justify-end gap-1.5 sm:flex">
                {s.en_vedette && <span className="rounded-md bg-citron px-2 py-0.5 text-xs font-medium">En avant</span>}
                {!s.actif && <span className="rounded-md border border-trait px-2 py-0.5 text-xs text-gris">Masqué</span>}
              </div>
              <div className="flex gap-1">
                <button type="button" onClick={() => setEdition(s)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white" aria-label={`Modifier ${s.titre}`}>
                  <Pencil className="h-4 w-4" strokeWidth={1.6} />
                </button>
                <button type="button" onClick={() => setASupprimer(s)} className="grid h-10 w-10 place-items-center rounded-full text-gris hover:bg-white hover:text-signal" aria-label={`Supprimer ${s.titre}`}>
                  <Trash2 className="h-4 w-4" strokeWidth={1.6} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {edition !== undefined && (
        <SolutionForm solution={edition} onFermer={() => setEdition(undefined)} onEnregistre={enregistre} />
      )}

      {aSupprimer && (
        <Modal titre="Supprimer cette solution ?" onFermer={() => setASupprimer(null)}>
          <p className="text-gris">« {aSupprimer.titre} » sera retirée du site.</p>
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
