const nettoyer = (valeur, max = 255) =>
  typeof valeur === 'string' ? valeur.trim().slice(0, max) : '';

const entier = (valeur) => {
  const n = Number.parseInt(valeur, 10);
  return Number.isInteger(n) ? n : null;
};

const genererSlug = (texte) =>
  String(texte)
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // retire les accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'solution';

module.exports = { nettoyer, entier, genererSlug };
