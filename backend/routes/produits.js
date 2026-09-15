const router = require('express').Router();
const pool = require('../config/db');
const { entier, normaliserProduit } = require('../services/utils');

const CHAMPS = 'id, type, nom, description, prix_usd, image_url, stock, en_vedette, cree_le';

router.get('/', async (req, res, next) => {
  try {
    const { type, q, vedette } = req.query;
    const conditions = ['actif = TRUE'];
    const valeurs = [];

    if (type === 'article' || type === 'application') {
      valeurs.push(type);
      conditions.push(`type = $${valeurs.length}`);
    }
    if (typeof q === 'string' && q.trim()) {
      valeurs.push(`%${q.trim().slice(0, 80)}%`);
      conditions.push(`(nom ILIKE $${valeurs.length} OR description ILIKE $${valeurs.length})`);
    }
    if (vedette === '1') conditions.push('en_vedette = TRUE');

    const { rows } = await pool.query(
      `SELECT ${CHAMPS} FROM produits WHERE ${conditions.join(' AND ')}
       ORDER BY en_vedette DESC, cree_le DESC`,
      valeurs
    );
    res.json(rows.map(normaliserProduit));
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = entier(req.params.id);
    if (!id) return res.status(404).json({ erreur: 'Produit introuvable.' });
    const { rows } = await pool.query(`SELECT ${CHAMPS} FROM produits WHERE id = $1 AND actif = TRUE`, [id]);
    if (!rows[0]) return res.status(404).json({ erreur: 'Produit introuvable.' });
    res.json(normaliserProduit(rows[0]));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
