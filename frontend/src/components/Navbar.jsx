import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import SelecteurLangue from './SelecteurLangue';
import { useLangue } from '../context/LangueContext';
import { SITE } from '../config/site';

export default function Navbar({ surImage = false }) {
  const { t } = useLangue();
  const [ouvert, setOuvert] = useState(false);
  const couleur = surImage ? 'text-white' : 'text-encre';

  const LIENS = [
    { vers: '#services', libelle: t.nav.expertises },
    { vers: '#methode', libelle: t.nav.methode },
    { vers: '#engagements', libelle: t.nav.engagements },
    { vers: '#contact', libelle: t.nav.contact },
  ];

  return (
    <header className={`relative z-20 ${couleur}`}>
      <div className="flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="text-[22px] font-normal tracking-tight">FoxGroup</span>
        </Link>

        <nav className="hidden items-center gap-8 text-[15px] font-normal sm:flex" aria-label="Navigation principale">
          {LIENS.map((l) => (
            <a key={l.vers} href={l.vers} className="pb-1 border-b-2 border-transparent transition-colors hover:border-current/30">
              {l.libelle}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <SelecteurLangue surImage={surImage} />
          <a href={SITE.whatsappUrl} target="_blank" rel="noreferrer"
            className={`hidden btn sm:inline-flex ${surImage ? 'bg-white/15 text-white hover:bg-white/25' : 'btn-sombre'}`}>
            {t.nav.contacter}
          </a>
          <button
            type="button"
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full sm:hidden ${surImage ? 'bg-white/15' : 'bg-white/70'}`}
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
            <a key={l.vers} href={l.vers} onClick={() => setOuvert(false)}
              className="rounded-2xl px-4 py-3 font-normal hover:bg-white">
              {l.libelle}
            </a>
          ))}
          <a href={SITE.whatsappUrl} target="_blank" rel="noreferrer" onClick={() => setOuvert(false)}
            className="rounded-2xl px-4 py-3 font-normal hover:bg-white">
            {t.nav.contacter}
          </a>
        </nav>
      )}
    </header>
  );
}
