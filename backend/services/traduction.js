// Traduction automatique français -> anglais via l'API gratuite MyMemory
// (aucune clé, aucun compte). En cas d'échec ou de texte vide, on retourne
// simplement le texte d'origine : l'anglais affichera alors le français,
// jamais d'erreur ni de champ vide.
//
// MyMemory limite chaque requête à 500 caractères : les paragraphes trop
// longs sont donc découpés (sans couper un mot) puis traduits morceau par
// morceau ; les sauts de paragraphe (\n\n) sont préservés explicitement,
// car l'API ne les renvoie pas de façon fiable dans sa réponse.

const LIMITE_CARACTERES = 480; // marge de sécurité sous la limite de 500 de l'API

function decouper(texte) {
  if (texte.length <= LIMITE_CARACTERES) return [texte];
  const morceaux = [];
  let reste = texte;
  while (reste.length > LIMITE_CARACTERES) {
    let coupe = reste.lastIndexOf('. ', LIMITE_CARACTERES);
    if (coupe < LIMITE_CARACTERES * 0.4) coupe = reste.lastIndexOf(' ', LIMITE_CARACTERES);
    if (coupe <= 0) coupe = LIMITE_CARACTERES;
    morceaux.push(reste.slice(0, coupe + 1).trim());
    reste = reste.slice(coupe + 1);
  }
  if (reste.trim()) morceaux.push(reste.trim());
  return morceaux;
}

async function traduireMorceau(morceau) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(morceau)}&langpair=fr|en`;
  const reponse = await fetch(url, { signal: AbortSignal.timeout(9000) });
  if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);
  const donnees = await reponse.json();
  const traduit = donnees?.responseData?.translatedText;
  if (
    typeof traduit !== 'string' ||
    !traduit.trim() ||
    (donnees?.responseStatus && Number(donnees.responseStatus) !== 200) ||
    /QUERY LENGTH LIMIT|INVALID|AMOUNT OF WORDS LIMIT/i.test(traduit)
  ) {
    throw new Error(traduit || 'Réponse de traduction invalide');
  }
  return traduit.trim();
}

async function traduireVersAnglais(texte) {
  const propre = typeof texte === 'string' ? texte.trim() : '';
  if (!propre) return '';

  try {
    const paragraphes = propre.split(/\n{2,}/);
    const paragraphesTraduits = [];
    // Séquentiel plutôt qu'en parallèle : évite de dépasser le débit autorisé par l'API gratuite.
    for (const paragraphe of paragraphes) {
      const morceaux = decouper(paragraphe.trim());
      const traductions = [];
      for (const morceau of morceaux) {
        traductions.push(await traduireMorceau(morceau));
      }
      paragraphesTraduits.push(traductions.join(' '));
    }
    return paragraphesTraduits.join('\n\n');
  } catch (err) {
    console.warn('Traduction anglaise indisponible, repli sur le texte original :', err.message);
    return propre;
  }
}

// Traduit plusieurs champs en une fois. `champs` est un objet { cle: texte }.
// Retourne un objet { cle_en: traduction }.
async function traduireChamps(champs) {
  const entrees = Object.entries(champs).filter(([, valeur]) => valeur);
  const sortie = {};
  for (const [cle, valeur] of entrees) {
    sortie[`${cle}_en`] = await traduireVersAnglais(valeur);
  }
  return sortie;
}

module.exports = { traduireVersAnglais, traduireChamps };
