require('dotenv').config();
const pool = require('../config/db');
const { initialiser } = require('../db/initialiser');

(async () => {
  try {
    await initialiser();
    console.log('Initialisation terminée.');
  } catch (err) {
    console.error("Échec de l'initialisation :", err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
