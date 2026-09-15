import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);
const CLE = 'fg_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(CLE));
  const [admin, setAdmin] = useState(null);
  const [verification, setVerification] = useState(Boolean(localStorage.getItem(CLE)));

  const deconnexion = useCallback(() => {
    localStorage.removeItem(CLE);
    setToken(null);
    setAdmin(null);
  }, []);

  useEffect(() => {
    if (!token) {
      setVerification(false);
      return;
    }
    api('/api/auth/moi', { token })
      .then((d) => setAdmin(d.admin))
      .catch(deconnexion)
      .finally(() => setVerification(false));
  }, [token, deconnexion]);

  const connexion = async (email, mot_de_passe) => {
    const d = await api('/api/auth/connexion', { methode: 'POST', corps: { email, mot_de_passe } });
    localStorage.setItem(CLE, d.token);
    setAdmin(d.admin);
    setToken(d.token);
  };

  const appel = useCallback(
    async (chemin, options = {}) => {
      try {
        return await api(chemin, { ...options, token });
      } catch (err) {
        if (err.status === 401) deconnexion();
        throw err;
      }
    },
    [token, deconnexion]
  );

  return (
    <AuthContext.Provider value={{ token, admin, verification, connexion, deconnexion, appel }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
