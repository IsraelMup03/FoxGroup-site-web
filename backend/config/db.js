const { Pool, types } = require('pg');

// Les colonnes DATE restent des chaînes "AAAA-MM-JJ" (évite les décalages de fuseau)
types.setTypeParser(1082, (valeur) => valeur);

const ssl = process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false };

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl,
  max: 10,
});

pool.on('error', (err) => console.error('Erreur PostgreSQL inattendue :', err.message));

module.exports = pool;
