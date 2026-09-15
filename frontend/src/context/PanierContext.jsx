import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const PanierContext = createContext(null);
const CLE = 'fg_panier';

const lire = () => {
  try {
    const valeur = JSON.parse(localStorage.getItem(CLE));
    return Array.isArray(valeur) ? valeur : [];
  } catch {
    return [];
  }
};

const borner = (quantite, stock) => {
  const max = stock === null || stock === undefined ? 100 : Math.min(stock, 100);
  return Math.max(1, Math.min(quantite, max));
};

export function PanierProvider({ children }) {
  const [lignes, setLignes] = useState(lire);

  useEffect(() => {
    localStorage.setItem(CLE, JSON.stringify(lignes));
  }, [lignes]);

  const valeur = useMemo(() => {
    const ajouter = (produit, quantite = 1) =>
      setLignes((actuelles) => {
        const existante = actuelles.find((l) => l.id === produit.id);
        if (existante) {
          return actuelles.map((l) =>
            l.id === produit.id ? { ...l, quantite: borner(l.quantite + quantite, produit.stock) } : l
          );
        }
        const { id, nom, type, prix_usd, image_url, stock } = produit;
        return [...actuelles, { id, nom, type, prix_usd, image_url, stock, quantite: borner(quantite, stock) }];
      });

    const changerQuantite = (id, quantite) =>
      setLignes((actuelles) =>
        actuelles.map((l) => (l.id === id ? { ...l, quantite: borner(quantite, l.stock) } : l))
      );

    const retirer = (id) => setLignes((actuelles) => actuelles.filter((l) => l.id !== id));
    const vider = () => setLignes([]);

    return {
      lignes,
      ajouter,
      changerQuantite,
      retirer,
      vider,
      nombre: lignes.reduce((s, l) => s + l.quantite, 0),
      totalUsd: lignes.reduce((s, l) => s + Math.round(l.prix_usd * 100) * l.quantite, 0) / 100,
    };
  }, [lignes]);

  return <PanierContext.Provider value={valeur}>{children}</PanierContext.Provider>;
}

export const usePanier = () => useContext(PanierContext);
