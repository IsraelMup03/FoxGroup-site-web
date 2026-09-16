import { Link } from 'react-router-dom';
import Cadre from '../components/Cadre';
import { Vide } from '../components/Etat';
import { useLangue } from '../context/LangueContext';

export default function Introuvable() {
  const { t } = useLangue();
  return (
    <Cadre>
      <Vide titre={t.introuvable.titre} texte={t.introuvable.texte}
        action={<Link to="/" className="btn btn-signal">{t.introuvable.retour}</Link>} />
    </Cadre>
  );
}
