import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Chargement } from '../components/Etat';

export default function RouteProtegee({ children }) {
  const { token, verification } = useAuth();
  const location = useLocation();
  if (verification) return <Chargement texte="Vérification de la session…" />;
  if (!token) return <Navigate to="/admin/connexion" replace state={{ depuis: location.pathname }} />;
  return children;
}
