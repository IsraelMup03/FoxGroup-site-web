import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Accueil from './pages/Accueil';
import Introuvable from './pages/Introuvable';
import BoutonRemonter from './components/BoutonRemonter';

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
        <Route path="*" element={<Introuvable />} />
      </Routes>
      <BoutonRemonter />
    </>
  );
}
