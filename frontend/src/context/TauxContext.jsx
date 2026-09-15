import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

const TauxContext = createContext(null);
const RAFRAICHISSEMENT = 10 * 60 * 1000;

export function TauxProvider({ children }) {
  const [etat, setEtat] = useState({ taux: null, source: null, mis_a_jour: null, chargement: true, erreur: null });

  const charger = useCallback(async () => {
    try {
      const donnees = await api('/api/taux');
      setEtat({ ...donnees, chargement: false, erreur: null });
    } catch (err) {
      setEtat((e) => ({ ...e, chargement: false, erreur: err.message }));
    }
  }, []);

  useEffect(() => {
    charger();
    const minuterie = setInterval(charger, RAFRAICHISSEMENT);
    return () => clearInterval(minuterie);
  }, [charger]);

  const enCDF = useCallback((usd) => (etat.taux ? Number(usd) * etat.taux : null), [etat.taux]);

  return <TauxContext.Provider value={{ ...etat, enCDF, recharger: charger }}>{children}</TauxContext.Provider>;
}

export const useTaux = () => useContext(TauxContext);
