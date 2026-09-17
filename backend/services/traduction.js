// Traduction automatique français -> anglais via l'API gratuite MyMemory
// (aucune clé, aucun compte). En cas d'échec ou de texte vide, on retourne
// simplement le texte d'origine : l'anglais affichera alors le français,
// jamais d'erreur ni de champ vide.

async function traduireVersAnglais(texte) {
  const propre = typeof texte === 'string' ? texte.trim() : '';
  if (!propre) return '';

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(propre)}&langpair=fr|en`;
    const reponse = await fetch(url, { signal: AbortSignal.timeout(9000) });
    if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);
    const donnees = await reponse.json();
    const traduit = donnees?.responseData?.translatedText;
    return typeof traduit === 'string' && traduit.trim() ? traduit : propre;
  } catch (err) {
    console.warn('Traduction anglaise indisponible, repli sur le texte original :', err.message);
    return propre;
  }
}

// Traduit plusieurs champs en une fois. `champs` est un objet { cle: texte }.
// Retourne un objet { cle_en: traduction }.
async function traduireChamps(champs) {
  const entrees = Object.entries(champs).filter(([, valeur]) => valeur);
  const resultats = await Promise.all(entrees.map(([, valeur]) => traduireVersAnglais(valeur)));
  const sortie = {};
  entrees.forEach(([cle], i) => { sortie[`${cle}_en`] = resultats[i]; });
  return sortie;
}

module.exports = { traduireVersAnglais, traduireChamps };
