require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { DOSSIER_LOCAL } = require('./config/cloudinary');
const { initialiser } = require('./db/initialiser');

for (const variable of ['DATABASE_URL', 'JWT_SECRET']) {
  if (!process.env[variable]) {
    console.error(`Variable d'environnement manquante : ${variable}`);
    process.exit(1);
  }
}

const app = express();
app.set('trust proxy', 1);

const origines = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: (origine, cb) => {
      if (!origine || origines.includes(origine)) return cb(null, true);
      const err = new Error(`Origine non autorisée par CORS : ${origine}`);
      err.status = 403;
      cb(err);
    },
  })
);
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(DOSSIER_LOCAL, { maxAge: '7d', immutable: true }));

// Limite globale anti-abus (scraping, bots) : large marge pour ne jamais gêner un usage normal.
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { erreur: 'Trop de requêtes. Réessayez dans quelques minutes.' },
  })
);

app.get('/', (req, res) => res.json({ service: 'API FoxGroup', statut: 'en ligne' }));
app.get('/api/sante', (req, res) => res.json({ statut: 'ok', heure: new Date().toISOString() }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/equipe', require('./routes/equipe'));
app.use('/api/solutions', require('./routes/solutions'));
app.use('/api/admin', require('./routes/admin'));

app.use((req, res) => res.status(404).json({ erreur: 'Route introuvable.' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ erreur: 'Le fichier est trop volumineux.' });
  }
  const statut = err.status || 500;
  if (statut >= 500) console.error(err);
  res.status(statut).json({ erreur: statut >= 500 ? 'Erreur interne du serveur.' : err.message });
});

const PORT = process.env.PORT || 5000;

initialiser()
  .then(() => console.log('Base de données prête (tables vérifiées, admin vérifié).'))
  .catch((err) => console.error("Échec de l'initialisation de la base :", err.message))
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`API FoxGroup sur le port ${PORT}`);
      console.log(`Origines autorisées : ${origines.join(', ')}`);
    });
  });
