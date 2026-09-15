import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTaux } from '../context/TauxContext';
import { Chargement, Erreur } from '../components/Etat';
import { formatCDF, formatDateHeure, formatNombre } from '../lib/format';

const SOURCES = { marche: 'Marché (automatique)', manuel: 'Manuel', manuel_secours: 'Manuel (le marché ne répondait pas)' };

export default function Taux() {
  const { appel } = useAuth();
  const { recharger } = useTaux();
  const [donnees, setDonnees] = useState(null);
  const [mode, setMode] = useState('auto');
  const [manuel, setManuel] = useState('');
  const [erreur, setErreur] = useState(null);
  const [message, setMessage] = useState(null);
  const [envoi, setEnvoi] = useState(false);

  const appliquer = (d) => {
    setDonnees(d);
    setMode(d.taux_mode);
    setManuel(d.taux_manuel ?? '');
  };

  const charger = useCallback(() => {
    setErreur(null);
    appel('/api/admin/parametres').then(appliquer).catch((e) => setErreur(e.message));
  }, [appel]);
  useEffect(charger, [charger]);

  const enregistrer = async (e) => {
    e.preventDefault();
    setErreur(null);
    setMessage(null);
    setEnvoi(true);
    try {
      const d = await appel('/api/admin/parametres', { methode: 'PUT', corps: { taux_mode: mode, taux_manuel: manuel } });
      appliquer(d);
      recharger();
      setMessage('Taux enregistré.');
    } catch (err) {
      setErreur(err.message);
    } finally {
      setEnvoi(false);
    }
  };

  if (!donnees && erreur) return <Erreur message={erreur} onReessayer={charger} />;
  if (!donnees) return <Chargement />;

  const actuel = donnees.taux_actuel;

  return (
    <div>
      <h1 className="px-2 pb-5 pt-2 text-4xl font-normal tracking-tight">Taux de change</h1>

      <div className="grid gap-3 lg:grid-cols-2">
        <section className="panneau p-6 sm:p-8">
          <h2 className="text-[17px] font-normal">Taux appliqué maintenant</h2>
          {actuel ? (
            <>
              <p className="mt-8"><span className="chiffre text-6xl">{formatNombre(actuel.taux)}</span> <span className="text-gris">FC pour 1 $</span></p>
              <dl className="mt-8 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-gris">Source</dt><dd>{SOURCES[actuel.source]}</dd></div>
                <div className="flex justify-between"><dt className="text-gris">Vérifié</dt><dd>{formatDateHeure(actuel.mis_a_jour)}</dd></div>
                <div className="flex justify-between"><dt className="text-gris">100 $</dt><dd>{formatCDF(actuel.taux * 100)}</dd></div>
              </dl>
            </>
          ) : (
            <p className="mt-6 text-gris">Aucun taux disponible. Définissez un taux manuel.</p>
          )}
        </section>

        <form onSubmit={enregistrer} className="panneau p-6 sm:p-8">
          <h2 className="text-[17px] font-normal">Réglage</h2>
          <fieldset className="mt-5 space-y-3">
            <legend className="sr-only">Mode</legend>
            {[
              ['auto', 'Automatique', 'Taux du marché, vérifié toutes les 30 minutes. Le taux manuel sert de secours si le service ne répond pas.'],
              ['manuel', 'Manuel', 'Vous fixez le taux vous-même, par exemple pour suivre le taux pratiqué à Kinshasa.'],
            ].map(([valeur, titre, texte]) => (
              <label key={valeur} className={`flex cursor-pointer gap-3 rounded-[20px] border p-4 ${mode === valeur ? 'border-ardoise bg-white' : 'border-trait bg-white/50'}`}>
                <input type="radio" name="mode" value={valeur} checked={mode === valeur} onChange={() => setMode(valeur)} className="mt-1 h-4 w-4 accent-signal" />
                <span>
                  <span className="block font-normal">{titre}</span>
                  <span className="text-sm text-gris">{texte}</span>
                </span>
              </label>
            ))}
          </fieldset>

          <label className="mt-5 block">
            <span className="libelle">Taux manuel (francs pour 1 dollar)</span>
            <input className="champ" type="number" min="0" step="0.01" value={manuel} onChange={(e) => setManuel(e.target.value)}
              required={mode === 'manuel'} placeholder="Ex. 2850" />
          </label>

          {erreur && <p className="mt-4 text-sm text-signal-fonce" role="alert">{erreur}</p>}
          {message && <p className="mt-4 text-sm text-encre" role="status">{message}</p>}

          <button type="submit" className="btn btn-signal mt-6" disabled={envoi}>
            {envoi ? 'Enregistrement…' : 'Enregistrer le taux'}
          </button>
        </form>
      </div>
    </div>
  );
}
