require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

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
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => res.json({ service: 'API FoxGroup', statut: 'en ligne' }));
app.get('/api/sante', (req, res) => res.json({ statut: 'ok', heure: new Date().toISOString() }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/produits', require('./routes/produits'));
app.use('/api/commandes', require('./routes/commandes'));
app.use('/api/taux', require('./routes/taux'));
app.use('/api/admin', require('./routes/admin'));

app.use((req, res) => res.status(404).json({ erreur: 'Route introuvable.' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ erreur: "L'image dépasse 5 Mo." });
  }
  const statut = err.status || 500;
  if (statut >= 500) console.error(err);
  res.status(statut).json({ erreur: statut >= 500 ? 'Erreur interne du serveur.' : err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API FoxGroup sur le port ${PORT}`);
  console.log(`Origines autorisées : ${origines.join(', ')}`);
});
