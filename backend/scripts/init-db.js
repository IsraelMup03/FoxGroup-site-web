require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

(async () => {
  try {
    const schema = fs.readFileSync(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8');
    await pool.query(schema);
    console.log('Tables créées ou déjà présentes.');

    await pool.query(
      `INSERT INTO parametres (cle, valeur) VALUES ('taux_mode', 'auto'), ('taux_manuel', NULL)
       ON CONFLICT (cle) DO NOTHING`
    );

    const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NOM } = process.env;
    if (ADMIN_EMAIL && ADMIN_PASSWORD) {
      const email = ADMIN_EMAIL.trim().toLowerCase();
      const { rows } = await pool.query('SELECT id FROM admins WHERE email = $1', [email]);
      if (rows.length) {
        console.log(`Administrateur ${email} déjà existant, inchangé.`);
      } else {
        const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
        await pool.query('INSERT INTO admins (nom, email, mot_de_passe) VALUES ($1, $2, $3)', [
          ADMIN_NOM || 'Administrateur', email, hash,
        ]);
        console.log(`Administrateur ${email} créé.`);
      }
    } else {
      console.warn('ADMIN_EMAIL ou ADMIN_PASSWORD manquant : aucun administrateur créé.');
    }
  } catch (err) {
    console.error('Échec de l’initialisation :', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
