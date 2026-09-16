const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function creerAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@foxgroup.cd').trim().toLowerCase();
  const motDePasse = process.env.ADMIN_PASSWORD || 'FoxGroup2026!';
  const nom = process.env.ADMIN_NOM || 'Administrateur FoxGroup';

  const { rows } = await pool.query('SELECT id FROM admins WHERE email = $1', [email]);
  if (rows.length) return { cree: false, email };

  const hash = await bcrypt.hash(motDePasse, 12);
  await pool.query('INSERT INTO admins (nom, email, mot_de_passe) VALUES ($1, $2, $3)', [nom, email, hash]);
  return { cree: true, email, motDePasse };
}

// Idempotent : peut être appelée à chaque démarrage du serveur sans risque.
async function initialiser() {
  const schema = fs.readFileSync(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8');
  await pool.query(schema);

  const resultatAdmin = await creerAdmin();
  if (resultatAdmin.cree) {
    console.log(`Administrateur créé : ${resultatAdmin.email} / ${resultatAdmin.motDePasse}`);
  }
}

module.exports = { initialiser, creerAdmin };
