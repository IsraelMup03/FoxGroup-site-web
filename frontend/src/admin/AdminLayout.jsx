import { NavLink, Outlet } from 'react-router-dom';
import { ArrowUpRight, LogOut, Sparkles, Users } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { useLangue } from '../context/LangueContext';

export default function AdminLayout() {
  const { admin, deconnexion } = useAuth();
  const { t } = useLangue();

  const LIENS = [
    { vers: '/admin', libelle: t.admin.layout.equipe, icone: Users, fin: true },
    { vers: '/admin/solutions', libelle: t.admin.layout.solutions, icone: Sparkles },
  ];

  return (
    <div className="mx-auto grid max-w-[1400px] gap-3 p-3 sm:p-6 lg:grid-cols-[250px_1fr]">
      <aside className="verre-sombre flex flex-col rounded-[28px] p-5 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
        <div className="flex items-center gap-2.5 px-2">
          <Logo className="h-6 w-6" />
          <span className="text-lg font-normal">FoxGroup</span>
        </div>

        <nav className="mt-6 flex gap-1 overflow-x-auto lg:mt-10 lg:flex-col" aria-label={t.admin.connexion.titre}>
          {LIENS.map(({ vers, libelle, icone: Icone, fin }) => (
            <NavLink key={vers} to={vers} end={fin}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] transition-colors ${isActive ? 'bg-white/12 text-white' : 'text-white/65 hover:text-white'}`}>
              {({ isActive }) => (
                <>
                  <Icone className="h-[18px] w-[18px]" strokeWidth={1.6} />
                  {libelle}
                  {isActive && <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-citron lg:block" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 hidden border-t border-white/10 pt-5 lg:mt-auto lg:block">
          <p className="px-2 text-sm text-white/60">{admin?.nom}</p>
          <p className="truncate px-2 text-sm text-white/40">{admin?.email}</p>
          <a href="/" target="_blank" rel="noreferrer" className="mt-4 flex items-center gap-3 rounded-2xl px-2 py-2 text-sm text-white/65 hover:text-white">
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} /> {t.admin.layout.voirLeSite}
          </a>
          <button type="button" onClick={deconnexion} className="flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-sm text-white/65 hover:text-white">
            <LogOut className="h-4 w-4" strokeWidth={1.6} /> {t.admin.layout.seDeconnecter}
          </button>
        </div>
        <button type="button" onClick={deconnexion} className="mt-3 flex items-center gap-2 px-2 text-sm text-white/65 lg:hidden">
          <LogOut className="h-4 w-4" strokeWidth={1.6} /> {t.admin.layout.seDeconnecter}
        </button>
      </aside>

      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
