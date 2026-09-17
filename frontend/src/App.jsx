import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import Accueil from './pages/Accueil';
import SolutionDetail from './pages/SolutionDetail';
import Introuvable from './pages/Introuvable';
import BoutonRemonter from './components/BoutonRemonter';
import { Chargement } from './components/Etat';

// Chargés à la demande : les visiteurs du site public ne téléchargent jamais le code de l'admin.
const Connexion = lazy(() => import('./admin/Connexion'));
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const RouteProtegee = lazy(() => import('./admin/RouteProtegee'));
const Equipe = lazy(() => import('./admin/Equipe'));
const Solutions = lazy(() => import('./admin/Solutions'));

function RemonterEnHaut() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <RemonterEnHaut />
      <Suspense fallback={<Chargement />}>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/solutions/:slug" element={<SolutionDetail />} />

          <Route path="/admin/connexion" element={<Connexion />} />
          <Route path="/admin" element={<RouteProtegee><AdminLayout /></RouteProtegee>}>
            <Route index element={<Equipe />} />
            <Route path="solutions" element={<Solutions />} />
          </Route>

          <Route path="*" element={<Introuvable />} />
        </Routes>
      </Suspense>
      <BoutonRemonter />
    </>
  );
}
