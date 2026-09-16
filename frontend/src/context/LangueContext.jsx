import { createContext, useContext, useEffect, useState } from 'react';
import { LANGUE_DEFAUT, TRADUCTIONS } from '../i18n/traductions';

const LangueContext = createContext(null);
const CLE = 'fg_langue';

function langueInitiale() {
  try {
    const sauvegardee = localStorage.getItem(CLE);
    if (sauvegardee && TRADUCTIONS[sauvegardee]) return sauvegardee;
  } catch {
    // localStorage indisponible (navigation privée...) : on garde le défaut
  }
  return LANGUE_DEFAUT;
}

export function LangueProvider({ children }) {
  const [langue, setLangueBrut] = useState(langueInitiale);

  useEffect(() => {
    document.documentElement.lang = langue;
    try {
      localStorage.setItem(CLE, langue);
    } catch {
      // rien à faire si le stockage est bloqué
    }
  }, [langue]);

  const definirLangue = (code) => {
    if (TRADUCTIONS[code]) setLangueBrut(code);
  };

  const t = TRADUCTIONS[langue] || TRADUCTIONS[LANGUE_DEFAUT];

  return (
    <LangueContext.Provider value={{ langue, definirLangue, t }}>
      {children}
    </LangueContext.Provider>
  );
}

export const useLangue = () => useContext(LangueContext);
