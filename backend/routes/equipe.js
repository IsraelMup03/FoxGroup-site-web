const router = require('express').Router();
const pool = require('../config/db');

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, nom, role, bio, photo_url FROM equipe
       WHERE actif = TRUE ORDER BY ordre ASC, id ASC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
