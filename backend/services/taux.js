const pool = require('../config/db');

const DUREE_CACHE = 30 * 60 * 1000; // 30 minutes
let cache = null;

async function lireParametres() {
  const { rows } = await pool.query(
    "SELECT cle, valeur FROM parametres WHERE cle IN ('taux_mode', 'taux_manuel')"
  );
  const p = Object.fromEntries(rows.map((r) => [r.cle, r.valeur]));
  const manuel = Number(p.taux_manuel);
  return { mode: p.taux_mode === 'manuel' ? 'manuel' : 'auto', manuel: manuel > 0 ? manuel : null };
}

async function tauxDuMarche() {
  const url = process.env.TAUX_API_URL || 'https://open.er-api.com/v6/latest/USD';
  const rep = await fetch(url, { signal: AbortSignal.timeout(6000) });
  if (!rep.ok) throw new Error(`HTTP ${rep.status}`);
  const donnees = await rep.json();
  const taux = Number(donnees?.rates?.CDF);
  if (!(taux > 0)) throw new Error('Taux CDF absent de la réponse');
  return { taux, maj_source: donnees.time_last_update_utc || null };
}

async function obtenirTaux({ forcer = false } = {}) {
  if (!forcer && cache && Date.now() < cache.expire) return cache.valeur;

  const params = await lireParametres();
  let valeur;
  let duree = DUREE_CACHE;

  if (params.mode === 'manuel' && params.manuel) {
    valeur = { taux: params.manuel, source: 'manuel' };
  } else {
    try {
      const marche = await tauxDuMarche();
      valeur = { taux: marche.taux, source: 'marche', maj_source: marche.maj_source };
    } catch (err) {
      console.warn('Taux du marché indisponible :', err.message);
      if (!params.manuel) {
        const aucun = new Error("Aucun taux disponible. Définissez un taux manuel dans l'administration.");
        aucun.public = true;
        throw aucun;
      }
      valeur = { taux: params.manuel, source: 'manuel_secours' };
      duree = 5 * 60 * 1000; // on réessaie le marché plus tôt
    }
  }

  valeur.mis_a_jour = new Date().toISOString();
  cache = { valeur, expire: Date.now() + duree };
  return valeur;
}

function viderCacheTaux() {
  cache = null;
}

module.exports = { obtenirTaux, viderCacheTaux, lireParametres };
