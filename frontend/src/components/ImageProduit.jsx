import { AppWindow, Cpu } from 'lucide-react';

export default function ImageProduit({ produit, className = '' }) {
  if (produit.image_url) {
    return <img src={produit.image_url} alt={produit.nom} loading="lazy" className={`object-cover ${className}`} />;
  }
  const Icone = produit.type === 'application' ? AppWindow : Cpu;
  return (
    <div className={`grid place-items-center bg-gradient-to-br from-[#C9D2E0] to-[#95A5C0] text-white ${className}`}>
      <Icone className="h-12 w-12" strokeWidth={1} />
    </div>
  );
}
