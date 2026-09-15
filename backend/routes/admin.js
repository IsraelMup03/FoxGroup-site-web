const router = require('express').Router();
const pool = require('../config/db');
const exigerAdmin = require('../middleware/auth');
const upload = require('../middleware/upload');
const { envoyerImage, supprimerImage } = require('../config/cloudinary');
const { obtenirTaux, viderCacheTaux, lireParametres } = require('../services/taux');
const { nettoyer, entier, normaliserProduit } = require('../services/utils');

router.use(exigerAdmin);

const FUSEAU = () => process.env.FUSEAU || 'Africa/Kinshasa';
const STATUTS = ['en_attente', 'confirmee', 'livree', 'annulee'];

/* ---------- Tableau de bord ---------- */

router.get('/stats', async (req, res, next) => {
  try {
    const fuseau = FUSEAU();
    const { rows: [stats] } = await pool.query(
      `SELECT
        (SELECT COUNT(*) FROM commandes WHERE statut = 'en_attente')::int AS en_attente,
        (SELECT COUNT(*) FROM commandes
           WHERE (cree_le AT TIME ZONE $1)::date = (NOW() AT TIME ZONE $1)::date)::int AS aujourdhui,
        (SELECT COALESCE(SUM(total_usd), 0) FROM commandes WHERE statut = 'livree')::float AS ventes_livrees_usd,
        (SELECT COUNT(*) FROM produits WHERE actif)::int AS produits_actifs`,
      [fuseau]
    );
    const { rows: rendezVous } = await pool.query(
      `SELECT id, reference, client_nom, client_telephone, adresse, date_rendez_vous, creneau, statut, total_usd
       FROM commandes
       WHERE statut IN ('en_attente', 'confirmee') AND date_rendez_vous >= (NOW() AT TIME ZONE $1)::date
       ORDER BY date_rendez_vous ASC, cree_le ASC LIMIT 8`,
      [fuseau]
    );
    res.json({ ...stats, rendez_vous: rendezVous.map((r) => ({ ...r, total_usd: Number(r.total_usd) })) });
  } catch (err) {
    next(err);
  }
});

/* ---------- Produits ---------- */

function lireProduit(corps) {
  const type = corps.type === 'application' ? 'application' : corps.type === 'article' ? 'article' : null;
  const nom = nettoyer(corps.nom, 150);
  const description = nettoyer(corps.description, 5000);
  const prix = Number(String(corps.prix_usd ?? '').replace(',', '.'));
  const stockBrut = String(corps.stock ?? '').trim();
  const stock = type === 'article' && stockBrut !== '' ? entier(stockBrut) : null;

  const erreurs = [];
  if (!type) erreurs.push('Choisissez le type : article ou application.');
  if (nom.length < 2) erreurs.push('Donnez un nom au produit.');
  if (!Number.isFinite(prix) || prix < 0) erreurs.push('Le prix doit être un nombre positif.');
  if (stockBrut !== '' && type === 'article' && (stock === null || stock < 0)) {
    erreurs.push('Le stock doit être un nombre entier positif, ou vide pour illimité.');
  }

  return {
    erreurs,
    produit: {
      type, nom, description, stock,
      prix_usd: Math.round(prix * 100) / 100,
      en_vedette: corps.en_vedette === 'true' || corps.en_vedette === true,
      actif: !(corps.actif === 'false' || corps.actif === false),
    },
  };
}

router.get('/produits', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM produits ORDER BY cree_le DESC');
    res.json(rows.map(normaliserProduit));
  } catch (err) {
    next(err);
  }
});

router.post('/produits', upload.single('image'), async (req, res, next) => {
  try {
    const { erreurs, produit: p } = lireProduit(req.body || {});
    if (erreurs.length) return res.status(400).json({ erreur: erreurs[0], erreurs });

    let image = null;
    if (req.file) image = await envoyerImage(req.file.buffer);

    const { rows } = await pool.query(
      `INSERT INTO produits (type, nom, description, prix_usd, stock, en_vedette, actif, image_url, image_public_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [p.type, p.nom, p.description, p.prix_usd, p.stock, p.en_vedette, p.actif,
        image?.secure_url || null, image?.public_id || null]
    );
    res.status(201).json(normaliserProduit(rows[0]));
  } catch (err) {
    next(err);
  }
});

router.put('/produits/:id', upload.single('image'), async (req, res, next) => {
  try {
    const id = entier(req.params.id);
    const { rows: existants } = await pool.query('SELECT * FROM produits WHERE id = $1', [id]);
    const ancien = existants[0];
    if (!ancien) return res.status(404).json({ erreur: 'Produit introuvable.' });

    const { erreurs, produit: p } = lireProduit(req.body || {});
    if (erreurs.length) return res.status(400).json({ erreur: erreurs[0], erreurs });

    let imageUrl = ancien.image_url;
    let imageId = ancien.image_public_id;
    let aSupprimer = null;

    if (req.file) {
      const image = await envoyerImage(req.file.buffer);
      aSupprimer = ancien.image_public_id;
      imageUrl = image.secure_url;
      imageId = image.public_id;
    } else if (req.body.retirer_image === 'true') {
      aSupprimer = ancien.image_public_id;
      imageUrl = null;
      imageId = null;
    }

    const { rows } = await pool.query(
      `UPDATE produits SET type=$1, nom=$2, description=$3, prix_usd=$4, stock=$5, en_vedette=$6,
         actif=$7, image_url=$8, image_public_id=$9, modifie_le=NOW()
       WHERE id=$10 RETURNING *`,
      [p.type, p.nom, p.description, p.prix_usd, p.stock, p.en_vedette, p.actif, imageUrl, imageId, id]
    );
    if (aSupprimer) await supprimerImage(aSupprimer);
    res.json(normaliserProduit(rows[0]));
  } catch (err) {
    next(err);
  }
});

router.delete('/produits/:id', async (req, res, next) => {
  try {
    const id = entier(req.params.id);
    const { rows } = await pool.query('DELETE FROM produits WHERE id = $1 RETURNING image_public_id', [id]);
    if (!rows[0]) return res.status(404).json({ erreur: 'Produit introuvable.' });
    await supprimerImage(rows[0].image_public_id);
    res.json({ supprime: true });
  } catch (err) {
    next(err);
  }
});

/* ---------- Commandes ---------- */

router.get('/commandes', async (req, res, next) => {
  try {
    const { statut, q } = req.query;
    const conditions = [];
    const valeurs = [];

    if (STATUTS.includes(statut)) {
      valeurs.push(statut);
      conditions.push(`c.statut = $${valeurs.length}`);
    }
    if (typeof q === 'string' && q.trim()) {
      valeurs.push(`%${q.trim().slice(0, 80)}%`);
      const i = valeurs.length;
      conditions.push(`(c.reference ILIKE $${i} OR c.client_nom ILIKE $${i} OR c.client_telephone ILIKE $${i} OR c.client_email ILIKE $${i})`);
    }

    const { rows } = await pool.query(
      `SELECT c.*,
         COALESCE(json_agg(json_build_object(
           'produit_id', l.produit_id, 'nom_produit', l.nom_produit, 'type', l.type,
           'prix_unitaire_usd', l.prix_unitaire_usd, 'quantite', l.quantite
         ) ORDER BY l.id) FILTER (WHERE l.id IS NOT NULL), '[]') AS lignes
       FROM commandes c
       LEFT JOIN lignes_commande l ON l.commande_id = c.id
       ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
       GROUP BY c.id
       ORDER BY c.cree_le DESC
       LIMIT 300`,
      valeurs
    );
    res.json(rows.map((c) => ({
      ...c,
      total_usd: Number(c.total_usd),
      total_cdf: Number(c.total_cdf),
      taux_cdf: Number(c.taux_cdf),
    })));
  } catch (err) {
    next(err);
  }
});

router.patch('/commandes/:id/statut', async (req, res, next) => {
  const id = entier(req.params.id);
  const statut = req.body?.statut;
  if (!STATUTS.includes(statut)) return res.status(400).json({ erreur: 'Statut inconnu.' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query('SELECT statut FROM commandes WHERE id = $1 FOR UPDATE', [id]);
    if (!rows[0]) {
      await client.query('ROLLBACK');
      return res.status(404).json({ erreur: 'Commande introuvable.' });
    }
    const ancien = rows[0].statut;

    if (ancien !== statut) {
      if (statut === 'annulee') {
        // On remet les articles en stock
        await client.query(
          `UPDATE produits p SET stock = p.stock + l.quantite
           FROM lignes_commande l
           WHERE l.commande_id = $1 AND l.produit_id = p.id AND p.stock IS NOT NULL`,
          [id]
        );
      } else if (ancien === 'annulee') {
        // Réactivation : on reprend le stock s'il est suffisant
        const { rows: manque } = await client.query(
          `SELECT p.nom FROM lignes_commande l JOIN produits p ON p.id = l.produit_id
           WHERE l.commande_id = $1 AND p.stock IS NOT NULL AND p.stock < l.quantite`,
          [id]
        );
        if (manque.length) {
          await client.query('ROLLBACK');
          return res.status(409).json({
            erreur: `Stock insuffisant pour réactiver la commande : ${manque.map((m) => m.nom).join(', ')}.`,
          });
        }
        await client.query(
          `UPDATE produits p SET stock = p.stock - l.quantite
           FROM lignes_commande l
           WHERE l.commande_id = $1 AND l.produit_id = p.id AND p.stock IS NOT NULL`,
          [id]
        );
      }
      await client.query('UPDATE commandes SET statut = $1, modifie_le = NOW() WHERE id = $2', [statut, id]);
    }

    await client.query('COMMIT');
    res.json({ id, statut });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    next(err);
  } finally {
    client.release();
  }
});

/* ---------- Taux de change ---------- */

router.get('/parametres', async (req, res, next) => {
  try {
    const params = await lireParametres();
    let actuel = null;
    try {
      actuel = await obtenirTaux();
    } catch {
      actuel = null;
    }
    res.json({ taux_mode: params.mode, taux_manuel: params.manuel, taux_actuel: actuel });
  } catch (err) {
    next(err);
  }
});

router.put('/parametres', async (req, res, next) => {
  try {
    const mode = req.body?.taux_mode === 'manuel' ? 'manuel' : 'auto';
    const brut = req.body?.taux_manuel;
    const manuel = brut === '' || brut === null || brut === undefined ? null : Number(String(brut).replace(',', '.'));

    if (manuel !== null && !(manuel > 0)) {
      return res.status(400).json({ erreur: 'Le taux manuel doit être un nombre supérieur à 0.' });
    }
    if (mode === 'manuel' && manuel === null) {
      return res.status(400).json({ erreur: 'Indiquez un taux manuel pour utiliser le mode manuel.' });
    }

    await pool.query(
      `INSERT INTO parametres (cle, valeur) VALUES ('taux_mode', $1), ('taux_manuel', $2)
       ON CONFLICT (cle) DO UPDATE SET valeur = EXCLUDED.valeur`,
      [mode, manuel === null ? null : String(manuel)]
    );
    viderCacheTaux();

    let actuel = null;
    try {
      actuel = await obtenirTaux({ forcer: true });
    } catch {
      actuel = null;
    }
    res.json({ taux_mode: mode, taux_manuel: manuel, taux_actuel: actuel });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
