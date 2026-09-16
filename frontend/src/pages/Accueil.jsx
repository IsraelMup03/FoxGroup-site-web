import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Check, Code2, GraduationCap, Headset,
  Lock, Network, ShieldCheck, Settings2, Sparkles, User, Workflow,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import { Chargement, Erreur } from '../components/Etat';
import { useLangue } from '../context/LangueContext';
import { api } from '../lib/api';
import { SITE } from '../config/site';

const ICONES_DOMAINES = [Code2, Settings2, Network];
const ICONES_ENGAGEMENTS = [ShieldCheck, GraduationCap, Headset, Lock];

function DecorHero() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* lueurs douces et chaudes, en lente dérive */}
      <div className="lueur absolute -right-32 -top-32 h-[620px] w-[620px] rounded-full bg-signal/30 blur-[130px]" />
      <div className="lueur-lente absolute -bottom-48 -left-32 h-[520px] w-[520px] rounded-full bg-citron/15 blur-[150px]" />
      <div className="lueur-centree-x absolute left-1/2 top-1/3 h-[420px] w-[420px] rounded-full bg-signal-fonce/20 blur-[160px]" />
      {/* grain fin, pour une texture plus chaleureuse qu'un aplat numérique */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.12] mix-blend-overlay">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      {/* vignette pour ancrer le texte */}
      <div className="absolute inset-0 bg-gradient-to-t from-encre via-transparent to-transparent" />
    </div>
  );
}

export default function Accueil() {
  const { t } = useLangue();
  const [equipe, setEquipe] = useState(null);
  const [erreurEquipe, setErreurEquipe] = useState(null);
  const [solutions, setSolutions] = useState(null);
  const [erreurSolutions, setErreurSolutions] = useState(null);

  useEffect(() => {
    api('/api/equipe').then(setEquipe).catch((e) => setErreurEquipe(e.message));
    api('/api/solutions').then(setSolutions).catch((e) => setErreurSolutions(e.message));
  }, []);

  return (
    <div>
      {/* Hero plein écran */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-encre text-white">
        <DecorHero />
        <div className="relative z-10 mx-auto flex w-full max-w-[1320px] flex-1 flex-col px-4 pt-5 sm:px-6 sm:pt-7">
          <Navbar surImage />

          <div className="flex flex-1 flex-col justify-center py-14">
            <p className="apparition apparition-1 text-sm font-medium uppercase tracking-[0.2em] text-white/60">{t.hero.slogan}</p>
            <h1 className="apparition apparition-2 mt-4 max-w-3xl text-[42px] font-semibold leading-[1.04] tracking-[-0.02em] sm:text-[76px]">
              {t.hero.titre1}<br />{t.hero.titre2}
            </h1>
            <p className="apparition apparition-3 mt-6 max-w-xl text-lg text-white/70">{t.hero.accroche}</p>
            <div className="apparition apparition-4 mt-9 flex flex-wrap items-center gap-3">
              <a href={SITE.whatsappUrl} target="_blank" rel="noreferrer" className="btn btn-signal px-7 py-3.5 text-base">
                {t.hero.cta1} <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
              </a>
              <a href="#methode" className="btn bg-white/10 px-7 py-3.5 text-base text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20">
                {t.hero.cta2}
              </a>
            </div>
          </div>

          <a href="#services" className="apparition apparition-4 mb-8 inline-flex items-center gap-2 self-start text-sm text-white/50 transition-colors hover:text-white">
            <ArrowDown className="h-4 w-4 animate-bounce" strokeWidth={1.8} /> {t.hero.decouvrir}
          </a>
        </div>
      </section>

      {/* Qui sommes-nous */}
      <section className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gris">{t.apropos.eyebrow}</p>
          <div className="mt-5 grid gap-8 lg:grid-cols-2 lg:gap-16">
            <h2 className="text-3xl font-normal leading-snug tracking-tight sm:text-4xl">{t.hero.accroche}</h2>
            <p className="text-lg text-gris">{t.apropos.description}</p>
          </div>
        </Reveal>
      </section>

      {/* Notre équipe */}
      <section id="equipe" className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gris">{t.equipe.eyebrow}</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-normal tracking-tight sm:text-5xl">{t.equipe.titre}</h2>
        </Reveal>

        <div className="mt-12">
          {erreurEquipe && <Erreur message={erreurEquipe} />}
          {!equipe && !erreurEquipe && <Chargement />}
          {equipe && equipe.length > 0 && (
            <Reveal as="div" groupe className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {equipe.map((m) => (
                <div key={m.id} className="panneau flex flex-col items-center p-6 text-center transition-transform duration-500 hover:-translate-y-1">
                  {m.photo_url ? (
                    <img src={m.photo_url} alt={m.nom} className="h-24 w-24 rounded-full object-cover" />
                  ) : (
                    <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-[#C9D2E0] to-[#95A5C0] text-white">
                      <User className="h-9 w-9" strokeWidth={1} />
                    </div>
                  )}
                  <h3 className="mt-4 text-lg font-normal">{m.nom}</h3>
                  <p className="text-sm text-signal">{m.role}</p>
                  {m.bio && <p className="mt-2 text-sm text-gris">{m.bio}</p>}
                </div>
              ))}
            </Reveal>
          )}
        </div>
      </section>

      {/* Domaines d'expertise */}
      <section id="services" className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gris">{t.domaines.eyebrow}</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-normal tracking-tight sm:text-5xl">{t.domaines.titre}</h2>
        </Reveal>

        <Reveal as="div" groupe className="mt-12 divide-y divide-trait border-y border-trait sm:mt-16">
          {t.domaines.liste.map((d, i) => {
            const Icone = ICONES_DOMAINES[i] ?? Code2;
            return (
              <div key={i} className="group grid gap-5 py-9 sm:grid-cols-[80px_1fr_auto] sm:gap-6">
                <span className="chiffre text-3xl text-gris">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-2xl font-normal">{d.titre}</h3>
                  <p className="mt-2 max-w-2xl text-gris">{d.texte}</p>
                  <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                    {d.items.map((it, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gris">
                        <Check className="h-3.5 w-3.5 shrink-0 text-signal" strokeWidth={2.2} />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
                <Icone className="hidden h-8 w-8 text-acier transition-transform duration-500 group-hover:scale-110 sm:block" strokeWidth={1.2} />
              </div>
            );
          })}
        </Reveal>
      </section>

      {/* Nos solutions */}
      <section id="solutions" className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gris">{t.solutions.eyebrow}</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-normal tracking-tight sm:text-5xl">{t.solutions.titre}</h2>
        </Reveal>

        <div className="mt-12">
          {erreurSolutions && <Erreur message={erreurSolutions} />}
          {!solutions && !erreurSolutions && <Chargement />}
          {solutions && solutions.length === 0 && (
            <div className="panneau flex flex-col items-center gap-2 px-6 py-16 text-center">
              <p className="text-xl font-normal">{t.solutions.videTitre}</p>
              <p className="max-w-md text-gris">{t.solutions.videTexte}</p>
            </div>
          )}
          {solutions && solutions.length > 0 && (
            <Reveal as="div" groupe className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {solutions.map((s) => (
                <Link key={s.id} to={`/solutions/${s.slug}`} className="panneau group flex flex-col overflow-hidden p-3">
                  <div className="overflow-hidden rounded-[20px] bg-ardoise">
                    {s.image_url ? (
                      <img src={s.image_url} alt={s.titre} loading="lazy"
                        className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="grid aspect-[4/3] w-full place-items-center text-white/50">
                        <Sparkles className="h-10 w-10" strokeWidth={1} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col px-2 pb-1 pt-4">
                    <h3 className="text-lg font-normal leading-snug">{s.titre}</h3>
                    {s.description_courte && <p className="mt-1.5 text-sm text-gris">{s.description_courte}</p>}
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-signal">
                      {t.solutions.enSavoirPlus} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
                    </span>
                  </div>
                </Link>
              ))}
            </Reveal>
          )}
        </div>
      </section>

      {/* Notre méthode, plein écran */}
      <section id="methode" className="bg-ardoise text-white">
        <div className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 sm:py-28">
          <Reveal>
            <div className="flex items-center gap-3 text-white/50">
              <Workflow className="h-5 w-5" strokeWidth={1.6} />
              <p className="text-sm font-medium uppercase tracking-[0.2em]">{t.methode.eyebrow}</p>
            </div>
            <h2 className="mt-4 max-w-2xl text-4xl font-normal tracking-tight sm:text-5xl">{t.methode.accroche}</h2>
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <p className="text-lg text-white/80">{t.methode.description}</p>
            </Reveal>

            <Reveal className="verre-sombre rounded-[28px] p-7 transition-transform duration-500 hover:-translate-y-1 sm:p-8">
              <h3 className="text-xl font-normal">{t.methode.inclusTitre}</h3>
              <Reveal as="ul" groupe className="mt-6 space-y-4">
                {t.methode.inclus.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-citron" strokeWidth={2} />
                    <span className="text-white/80">{f}</span>
                  </li>
                ))}
              </Reveal>
              <a href={SITE.whatsappUrl} target="_blank" rel="noreferrer" className="btn btn-signal mt-8 w-full">
                {t.methode.cta}
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section id="engagements" className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gris">{t.engagements.eyebrow}</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-normal tracking-tight sm:text-5xl">{t.engagements.titre}</h2>
        </Reveal>

        <Reveal as="div" groupe className="mt-12 grid gap-3 sm:grid-cols-2">
          {t.engagements.liste.map((e, i) => {
            const Icone = ICONES_ENGAGEMENTS[i] ?? ShieldCheck;
            return (
              <div key={i} className="panneau p-7 transition-transform duration-500 hover:-translate-y-1 sm:p-8">
                <Icone className="h-7 w-7 text-signal" strokeWidth={1.4} />
                <h3 className="mt-4 text-xl font-normal">{e.titre}</h3>
                <p className="mt-2 text-gris">{e.texte}</p>
              </div>
            );
          })}
        </Reveal>
      </section>

      {/* Contact, plein écran */}
      <section id="contact" className="relative overflow-hidden bg-encre text-white">
        <div aria-hidden className="lueur-centree pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] rounded-full bg-signal/20 blur-[140px]" />
        <Reveal as="div" className="relative mx-auto max-w-[1320px] px-4 py-24 text-center sm:px-6 sm:py-32">
          <h2 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">{t.contact.titre}</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">{SITE.telephone} · {SITE.ville}</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href={SITE.whatsappUrl} target="_blank" rel="noreferrer" className="btn btn-signal px-7 py-3.5 text-base">
              {t.contact.whatsapp}
            </a>
            <a href={`tel:${SITE.telephone.replace(/\s/g, '')}`} className="btn bg-white/10 px-7 py-3.5 text-base text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20">
              {t.contact.appeler}
            </a>
          </div>
        </Reveal>
      </section>

      <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
        <Footer />
      </div>
    </div>
  );
}
