const router = require('express').Router();
const pool = require('../config/db');

const CHAMPS = `id, titre, titre_en, slug, description_courte, description_courte_en,
  description, description_en, probleme_resolu, probleme_resolu_en, image_url, en_vedette, cree_le`;

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT ${CHAMPS} FROM solutions WHERE actif = TRUE ORDER BY ordre ASC, cree_le DESC`
    );
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT ${CHAMPS} FROM solutions WHERE slug = $1 AND actif = TRUE`,
      [req.params.slug]
    );
    if (!rows[0]) return res.status(404).json({ erreur: 'Solution introuvable.' });
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
