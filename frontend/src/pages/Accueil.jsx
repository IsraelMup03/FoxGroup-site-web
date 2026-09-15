import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CadranTaux from '../components/CadranTaux';
import CarteProduit from '../components/CarteProduit';
import { Chargement, Erreur } from '../components/Etat';
import { api } from '../lib/api';
import { formatUSD } from '../lib/format';

function Sphere({ nouveaute }) {
  return (
    <div className="pointer-events-none absolute -right-28 top-16 w-[560px] max-w-none sm:-right-16 lg:-right-36" aria-hidden="true">
      <svg viewBox="0 0 560 560" className="w-full">
        <defs>
          <radialGradient id="corps" cx="36%" cy="30%" r="78%">
            <stop offset="0" stopColor="#F5F8FC" />
            <stop offset="0.45" stopColor="#C3CDDD" />
            <stop offset="1" stopColor="#7486A5" />
          </radialGradient>
          <radialGradient id="noyau" cx="40%" cy="35%" r="70%">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#A9B6CB" />
          </radialGradient>
          <filter id="lueur" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <circle cx="280" cy="280" r="262" fill="none" stroke="#fff" strokeOpacity="0.28" />
        <circle cx="280" cy="280" r="214" fill="url(#corps)" />
        <circle cx="280" cy="280" r="150" fill="none" stroke="#fff" strokeOpacity="0.45" />
        <circle cx="280" cy="280" r="92" fill="url(#noyau)" />
        <path d="M 280 188 A 92 92 0 0 1 368 254" fill="none" stroke="var(--color-citron)" strokeWidth="1.5" />
        <circle cx="328" cy="236" r="10" fill="var(--color-citron)" filter="url(#lueur)" />
        <circle cx="328" cy="236" r="5" fill="var(--color-citron)" />
      </svg>
      {nouveaute && (
        <p className="absolute left-[46%] top-[47%] max-w-[180px] truncate text-[13px] text-citron">
          Nouveau : {nouveaute}
        </p>
      )}
    </div>
  );
}

export default function Accueil() {
  const [produits, setProduits] = useState(null);
  const [erreur, setErreur] = useState(null);

  const charger = () => {
    setErreur(null);
    api('/api/produits').then(setProduits).catch((e) => setErreur(e.message));
  };
  useEffect(charger, []);

  const applications = produits?.filter((p) => p.type === 'application').length ?? 0;
  const articles = produits?.filter((p) => p.type === 'article').length ?? 0;
  const recents = produits ? [...produits].sort((a, b) => new Date(b.cree_le) - new Date(a.cree_le)).slice(0, 3) : [];
  const vedettes = produits ? (produits.some((p) => p.en_vedette) ? produits.filter((p) => p.en_vedette) : produits).slice(0, 4) : [];

  return (
    <div className="mx-auto max-w-[1320px] p-3 sm:p-6">
      <div className="grid gap-3 lg:grid-cols-[1.08fr_1fr_1fr] lg:grid-rows-[auto_auto_auto]">
        {/* Panneau principal */}
        <section className="relative flex min-h-[600px] flex-col overflow-hidden rounded-[28px] bg-gradient-to-br from-[#7D90B0] via-[#A4B2C8] to-[#CBD3E0] p-6 sm:p-8 lg:row-span-3 lg:min-h-[760px]">
          <Navbar surImage />
          <Sphere nouveaute={recents[0]?.nom} />

          <div className="verre-sombre relative z-10 mt-auto w-full max-w-[290px] p-5 sm:mt-44">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2.5 text-[17px] font-normal">
                Commande
                <span className="rounded-md bg-citron px-2 py-0.5 text-xs font-medium text-encre">Sans compte</span>
              </p>
            </div>
            <dl className="mt-5 space-y-3.5 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-white/65">Paiement</dt><dd>À la livraison</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-white/65">Prix</dt><dd>Dollars et francs</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-white/65">Rendez-vous</dt><dd>Le jour choisi</dd></div>
            </dl>
          </div>

          <div className="relative z-10 mt-10 sm:mt-auto">
            <h1 className="apparition max-w-[460px] text-[40px] font-semibold leading-[1.02] tracking-[-0.02em] text-white sm:text-[54px]">
              Applications et matériel informatique
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/catalogue" className="btn btn-signal">Voir le catalogue</Link>
              <Link to="/catalogue?type=application" className="btn bg-white/20 text-white hover:bg-white/30">Applications</Link>
            </div>
          </div>
        </section>

        {/* Nouveautés */}
        <section className="panneau flex flex-col p-6 sm:p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-normal">Nouveautés</h2>
            <Link to="/catalogue" className="text-sm text-gris hover:text-encre">Tout voir</Link>
          </div>
          {!produits && !erreur && <Chargement />}
          {erreur && <p className="mt-6 text-sm text-gris">{erreur}</p>}
          {produits && recents.length === 0 && (
            <p className="mt-6 text-gris">Les premiers produits arrivent bientôt.</p>
          )}
          <ul className="mt-5 divide-y divide-trait">
            {recents.map((p) => (
              <li key={p.id}>
                <Link to={`/produit/${p.id}`} className="flex items-center justify-between gap-4 py-3.5 hover:text-signal">
                  <span className="min-w-0">
                    <span className="block truncate font-normal">{p.nom}</span>
                    <span className="text-sm text-gris">{p.type === 'application' ? 'Application' : 'Article'}</span>
                  </span>
                  <span className="shrink-0 tabular-nums">{formatUSD(p.prix_usd)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Cadran du taux */}
        <div className="lg:row-span-2">
          <CadranTaux />
        </div>

        {/* Compteurs */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/catalogue?type=application" className="panneau flex flex-col p-6 hover:bg-white">
            <h2 className="text-[17px] font-normal">Applications</h2>
            <p className="mt-auto pt-10">
              <span className="chiffre text-[58px]">{applications}</span>
              <span className="ml-1.5 text-gris">disponibles</span>
            </p>
          </Link>
          <Link to="/catalogue?type=article" className="panneau flex flex-col p-6 hover:bg-white">
            <h2 className="text-[17px] font-normal">Articles</h2>
            <p className="mt-auto pt-10">
              <span className="chiffre text-[58px]">{articles}</span>
              <span className="ml-1.5 text-gris">en catalogue</span>
            </p>
          </Link>
        </div>

        {/* Étapes */}
        <section className="panneau p-6 sm:p-7">
          <h2 className="text-[17px] font-normal">Commander en trois étapes</h2>
          <ol className="mt-5 space-y-4">
            {[
              ['Choisissez', 'Ajoutez vos applications ou articles au panier.'],
              ['Réservez', 'Donnez votre nom, un contact, votre adresse et le jour qui vous convient.'],
              ['Payez à la livraison', 'Nous venons au rendez-vous. Vous payez en dollars ou en francs.'],
            ].map(([titre, texte], i) => (
              <li key={titre} className="flex gap-4">
                <span className="chiffre w-6 shrink-0 text-[30px] text-signal">{i + 1}</span>
                <span>
                  <span className="block font-normal">{titre}</span>
                  <span className="text-sm text-gris">{texte}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Vedettes */}
      <section className="mt-3 rounded-[28px] p-3 sm:p-4" aria-labelledby="titre-vedettes">
        <div className="mb-5 mt-6 flex items-end justify-between px-2">
          <h2 id="titre-vedettes" className="text-3xl font-normal tracking-tight sm:text-4xl">À la une</h2>
          <Link to="/catalogue" className="btn btn-clair">Tout le catalogue</Link>
        </div>
        {erreur && <Erreur message={erreur} onReessayer={charger} />}
        {!produits && !erreur && <Chargement />}
        {produits && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {vedettes.map((p) => <CarteProduit key={p.id} produit={p} />)}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
