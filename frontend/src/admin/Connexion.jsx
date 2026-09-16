import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export default function Connexion() {
  const { connexion, token } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState(null);
  const [envoi, setEnvoi] = useState(false);

  if (token) return <Navigate to="/admin" replace />;

  const envoyer = async (e) => {
    e.preventDefault();
    setErreur(null);
    setEnvoi(true);
    try {
      await connexion(email, motDePasse);
      navigate(state?.depuis || '/admin', { replace: true });
    } catch (err) {
      setErreur(err.message);
      setEnvoi(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-encre p-4">
      <form onSubmit={envoyer} className="panneau w-full max-w-sm p-8">
        <div className="flex items-center gap-2.5">
          <Logo />
          <span className="text-xl font-normal">FoxGroup</span>
        </div>
        <h1 className="mt-8 text-3xl font-normal tracking-tight">Administration</h1>
        <p className="mt-2 text-sm text-gris">Connexion réservée à l'administrateur.</p>

        <label className="mt-6 block">
          <span className="libelle">Email</span>
          <input className="champ" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
        </label>
        <label className="mt-4 block">
          <span className="libelle">Mot de passe</span>
          <input className="champ" type="password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} required autoComplete="current-password" />
        </label>

        {erreur && <p className="mt-4 text-sm text-signal-fonce" role="alert">{erreur}</p>}

        <button type="submit" className="btn btn-signal mt-6 w-full py-3" disabled={envoi}>
          {envoi ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
