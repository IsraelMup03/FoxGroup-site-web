require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.set('trust proxy', 1);

const origines = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);

app.use(helmet());
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

app.use((req, res) => res.status(404).json({ erreur: 'Route introuvable.' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const statut = err.status || 500;
  if (statut >= 500) console.error(err);
  res.status(statut).json({ erreur: statut >= 500 ? 'Erreur interne du serveur.' : err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API FoxGroup sur le port ${PORT}`);
});
