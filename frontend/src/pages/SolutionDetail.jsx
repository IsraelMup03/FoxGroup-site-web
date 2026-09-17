import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Sparkles } from 'lucide-react';
import Cadre from '../components/Cadre';
import { Chargement, Vide } from '../components/Etat';
import { useLangue } from '../context/LangueContext';
import { api } from '../lib/api';
import { SITE } from '../config/site';

export default function SolutionDetail() {
  const { slug } = useParams();
  const { t } = useLangue();
  const [solution, setSolution] = useState(undefined); // undefined = chargement, null = introuvable
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    setSolution(undefined);
    setErreur(null);
    api(`/api/solutions/${slug}`)
      .then(setSolution)
      .catch((e) => (e.status === 404 ? setSolution(null) : setErreur(e.message)));
  }, [slug]);

  if (solution === undefined && !erreur) {
    return <Cadre><Chargement /></Cadre>;
  }

  if (solution === null || erreur) {
    return (
      <Cadre>
        <Vide titre={t.solutionDetail.introuvableTitre} texte={erreur || t.solutionDetail.introuvableTexte}
          action={<Link to="/" className="btn btn-signal">{t.solutionDetail.retour}</Link>} />
      </Cadre>
    );
  }

  const lienWhatsapp = `${SITE.whatsappUrl}?text=${encodeURIComponent(t.solutionDetail.message(solution.titre))}`;

  return (
    <Cadre>
      <Link to="/" className="apparition apparition-1 inline-flex items-center gap-2 text-sm text-gris transition-colors hover:text-encre">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.8} /> {t.solutionDetail.retour}
      </Link>

      {/* min-w-0 sur les deux colonnes : empêche un long mot sans espace (ou une image) de forcer une largeur plus grande que l'écran */}
      <div className="mt-6 grid gap-8 overflow-hidden lg:grid-cols-2 lg:gap-12">
        <div className="zoom-in min-w-0 overflow-hidden rounded-[28px] bg-ardoise">
          {solution.image_url ? (
            <img src={solution.image_url} alt={solution.titre}
              className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-105" />
          ) : (
            <div className="grid aspect-square w-full place-items-center text-white/50">
              <Sparkles className="h-16 w-16" strokeWidth={1} />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h1 className="apparition apparition-2 break-words text-4xl font-normal tracking-tight sm:text-5xl">{solution.titre}</h1>
          {solution.description && (
            <p className="apparition apparition-3 mt-5 whitespace-pre-line break-words text-lg text-gris">{solution.description}</p>
          )}

          {solution.probleme_resolu && (
            <div className="apparition apparition-4 panneau mt-8 p-6 sm:p-7">
              <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-gris">{t.solutionDetail.ceQueCaResout}</h2>
              <p className="mt-3 whitespace-pre-line break-words text-encre">{solution.probleme_resolu}</p>
            </div>
          )}

          <a href={lienWhatsapp} target="_blank" rel="noreferrer"
            className="apparition apparition-5 pulse-douce btn btn-signal mt-8 w-full rounded-full py-3.5 text-base sm:w-auto">
            <MessageCircle className="h-5 w-5" strokeWidth={1.8} /> {t.solutionDetail.cta}
          </a>
        </div>
      </div>
    </Cadre>
  );
}
