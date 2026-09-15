import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, ShoppingBag, X } from 'lucide-react';
import Logo from './Logo';
import { usePanier } from '../context/PanierContext';

const LIENS = [
  { vers: '/', libelle: 'Accueil', fin: true },
  { vers: '/catalogue', libelle: 'Catalogue' },
];

export default function Navbar({ surImage = false }) {
  const { nombre } = usePanier();
  const [ouvert, setOuvert] = useState(false);
  const couleur = surImage ? 'text-white' : 'text-encre';

  const classeLien = ({ isActive }) =>
    `pb-1 border-b-2 transition-colors ${isActive ? 'border-citron' : 'border-transparent hover:border-current/30'}`;

  return (
    <header className={`relative z-20 ${couleur}`}>
      <div className="flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="text-[22px] font-normal tracking-tight">FoxGroup</span>
        </Link>

        <nav className="hidden items-center gap-8 text-[15px] font-normal sm:flex" aria-label="Navigation principale">
          {LIENS.map((l) => (
            <NavLink key={l.vers} to={l.vers} end={l.fin} className={classeLien}>
              {l.libelle}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/panier"
            className={`relative grid h-11 w-11 place-items-center rounded-full ${surImage ? 'bg-white/15 hover:bg-white/25' : 'bg-white/70 hover:bg-white'}`}
            aria-label={`Panier, ${nombre} article${nombre > 1 ? 's' : ''}`}
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.6} />
            {nombre > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-citron px-1 text-xs font-medium text-encre">
                {nombre}
              </span>
            )}
          </Link>
          <button
            type="button"
            className={`grid h-11 w-11 place-items-center rounded-full sm:hidden ${surImage ? 'bg-white/15' : 'bg-white/70'}`}
            onClick={() => setOuvert((o) => !o)}
            aria-expanded={ouvert}
            aria-label="Menu"
          >
            {ouvert ? <X className="h-5 w-5" strokeWidth={1.6} /> : <Menu className="h-5 w-5" strokeWidth={1.6} />}
          </button>
        </div>
      </div>

      {ouvert && (
        <nav className="panneau mt-3 flex flex-col p-2 text-encre sm:hidden" aria-label="Navigation mobile">
          {LIENS.map((l) => (
            <NavLink key={l.vers} to={l.vers} end={l.fin} onClick={() => setOuvert(false)}
              className="rounded-2xl px-4 py-3 font-normal hover:bg-white">
              {l.libelle}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
