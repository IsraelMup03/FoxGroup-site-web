import { Link } from 'react-router-dom';
import Cadre from '../components/Cadre';
import { Vide } from '../components/Etat';

export default function Introuvable() {
  return (
    <Cadre>
      <Vide titre="Cette page n’existe pas" texte="Le lien est peut-être incorrect."
        action={<Link to="/" className="btn btn-signal">Retour à l’accueil</Link>} />
    </Cadre>
  );
}
