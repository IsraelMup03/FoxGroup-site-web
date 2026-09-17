// Choisit la version d'un champ selon la langue active.
// Seul l'anglais a une traduction automatique en base (`<champ>_en`) ;
// le français et le lingala affichent le texte original saisi par l'admin.
export function ct(objet, champ, langue) {
  if (langue === 'en') return objet[`${champ}_en`] || objet[champ];
  return objet[champ];
}
