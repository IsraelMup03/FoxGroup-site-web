import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Accueil from './pages/Accueil';
import Catalogue from './pages/Catalogue';
import Produit from './pages/Produit';
import Panier from './pages/Panier';
import Confirmation from './pages/Confirmation';
import Introuvable from './pages/Introuvable';
import Connexion from './admin/Connexion';
import AdminLayout from './admin/AdminLayout';
import RouteProtegee from './admin/RouteProtegee';
import TableauDeBord from './admin/TableauDeBord';
import Commandes from './admin/Commandes';
import Produits from './admin/Produits';
import Taux from './admin/Taux';

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
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/produit/:id" element={<Produit />} />
        <Route path="/panier" element={<Panier />} />
        <Route path="/confirmation" element={<Confirmation />} />

        <Route path="/admin/connexion" element={<Connexion />} />
        <Route path="/admin" element={<RouteProtegee><AdminLayout /></RouteProtegee>}>
          <Route index element={<TableauDeBord />} />
          <Route path="commandes" element={<Commandes />} />
          <Route path="produits" element={<Produits />} />
          <Route path="taux" element={<Taux />} />
        </Route>

        <Route path="*" element={<Introuvable />} />
      </Routes>
    </>
  );
}
