const { Pool } = require('pg');

const ssl = process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false };

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl,
  max: 10,
});

pool.on('error', (err) => console.error('Erreur PostgreSQL inattendue :', err.message));

module.exports = pool;
