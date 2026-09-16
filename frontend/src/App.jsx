import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Accueil from './pages/Accueil';
import SolutionDetail from './pages/SolutionDetail';
import Introuvable from './pages/Introuvable';
import BoutonRemonter from './components/BoutonRemonter';
import Connexion from './admin/Connexion';
import AdminLayout from './admin/AdminLayout';
import RouteProtegee from './admin/RouteProtegee';
import Equipe from './admin/Equipe';
import Solutions from './admin/Solutions';

function RemonterEnHaut() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <RemonterEnHaut />
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
      <BoutonRemonter />
    </>
  );
}
