const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const pool = require('../config/db');
const exigerAdmin = require('../middleware/auth');

const limiteConnexion = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { erreur: 'Trop de tentatives. Réessayez dans 15 minutes.' },
});

router.post('/connexion', limiteConnexion, async (req, res, next) => {
  try {
    const { email, mot_de_passe } = req.body || {};
    if (!email || !mot_de_passe) {
      return res.status(400).json({ erreur: 'Saisissez votre email et votre mot de passe.' });
    }

    const { rows } = await pool.query('SELECT * FROM admins WHERE email = $1', [
      String(email).trim().toLowerCase(),
    ]);
    const admin = rows[0];
    const valide = admin && (await bcrypt.compare(String(mot_de_passe), admin.mot_de_passe));
    if (!valide) return res.status(401).json({ erreur: 'Email ou mot de passe incorrect.' });

    const profil = { id: admin.id, nom: admin.nom, email: admin.email };
    const token = jwt.sign(profil, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, admin: profil });
  } catch (err) {
    next(err);
  }
});

router.get('/moi', exigerAdmin, (req, res) => {
  const { id, nom, email } = req.admin;
  res.json({ admin: { id, nom, email } });
});

module.exports = router;
