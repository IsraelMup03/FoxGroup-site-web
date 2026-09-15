export const STATUTS = {
  en_attente: { libelle: 'En attente', classe: 'bg-citron text-encre' },
  confirmee: { libelle: 'Confirmée', classe: 'bg-ardoise text-white' },
  livree: { libelle: 'Livrée', classe: 'bg-white text-encre border border-trait' },
  annulee: { libelle: 'Annulée', classe: 'border border-signal/40 text-signal-fonce' },
};

export default function Statut({ statut }) {
  const s = STATUTS[statut] || { libelle: statut, classe: 'bg-white' };
  return <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${s.classe}`}>{s.libelle}</span>;
}
