const router = require('express').Router();
const { obtenirTaux } = require('../services/taux');

router.get('/', async (req, res) => {
  try {
    res.json(await obtenirTaux());
  } catch (err) {
    if (!err.public) console.error('Lecture du taux impossible :', err.message);
    res.status(503).json({ erreur: err.public ? err.message : 'Taux de change momentanément indisponible.' });
  }
});

module.exports = router;
