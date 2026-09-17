const router = require('express').Router();
const pool = require('../config/db');
const exigerAdmin = require('../middleware/auth');
const uploadMedia = require('../middleware/uploadMedia');
const { envoyerMedia, supprimerMedia } = require('../config/cloudinary');
const { nettoyer, entier, genererSlug } = require('../services/utils');
const { traduireChamps } = require('../services/traduction');

router.use(exigerAdmin);

const urlBase = (req) => `${req.protocol}://${req.get('host')}`;

/* ---------- Équipe ---------- */

router.get('/equipe', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM equipe ORDER BY ordre ASC, id ASC');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/equipe', uploadMedia.single('photo'), async (req, res, next) => {
  try {
    const nom = nettoyer(req.body?.nom, 150);
    const role = nettoyer(req.body?.role, 150);
    const bio = nettoyer(req.body?.bio, 2000);
    const ordre = entier(req.body?.ordre) ?? 0;

    const erreurs = [];
    if (nom.length < 2) erreurs.push('Donnez un nom.');
    if (role.length < 2) erreurs.push('Donnez un rôle.');
    if (erreurs.length) return res.status(400).json({ erreur: erreurs[0], erreurs });

    let photo = null;
    if (req.file) photo = await envoyerMedia(req.file.buffer, 'image', { mimetype: req.file.mimetype, baseUrl: urlBase(req) });

    const { role_en, bio_en } = await traduireChamps({ role, bio });

    const { rows } = await pool.query(
      `INSERT INTO equipe (nom, role, role_en, bio, bio_en, ordre, photo_url, photo_public_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [nom, role, role_en, bio, bio_en, ordre, photo?.secure_url || null, photo?.public_id || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put('/equipe/:id', uploadMedia.single('photo'), async (req, res, next) => {
  try {
    const id = entier(req.params.id);
    const { rows: existants } = await pool.query('SELECT * FROM equipe WHERE id = $1', [id]);
    const ancien = existants[0];
    if (!ancien) return res.status(404).json({ erreur: 'Membre introuvable.' });

    const nom = nettoyer(req.body?.nom, 150);
    const role = nettoyer(req.body?.role, 150);
    const bio = nettoyer(req.body?.bio, 2000);
    const ordre = entier(req.body?.ordre) ?? ancien.ordre;
    const actif = !(req.body?.actif === 'false' || req.body?.actif === false);

    const erreurs = [];
    if (nom.length < 2) erreurs.push('Donnez un nom.');
    if (role.length < 2) erreurs.push('Donnez un rôle.');
    if (erreurs.length) return res.status(400).json({ erreur: erreurs[0], erreurs });

    let photoUrl = ancien.photo_url;
    let photoId = ancien.photo_public_id;
    let aSupprimer = null;

    if (req.file) {
      const photo = await envoyerMedia(req.file.buffer, 'image', { mimetype: req.file.mimetype, baseUrl: urlBase(req) });
      aSupprimer = ancien.photo_public_id;
      photoUrl = photo.secure_url;
      photoId = photo.public_id;
    } else if (req.body?.retirer_photo === 'true') {
      aSupprimer = ancien.photo_public_id;
      photoUrl = null;
      photoId = null;
    }

    const { role_en, bio_en } = await traduireChamps({ role, bio });

    const { rows } = await pool.query(
      `UPDATE equipe SET nom=$1, role=$2, role_en=$3, bio=$4, bio_en=$5, ordre=$6, actif=$7, photo_url=$8, photo_public_id=$9
       WHERE id=$10 RETURNING *`,
      [nom, role, role_en, bio, bio_en, ordre, actif, photoUrl, photoId, id]
    );
    if (aSupprimer) await supprimerMedia(aSupprimer);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/equipe/:id', async (req, res, next) => {
  try {
    const id = entier(req.params.id);
    const { rows } = await pool.query('DELETE FROM equipe WHERE id = $1 RETURNING photo_public_id', [id]);
    if (!rows[0]) return res.status(404).json({ erreur: 'Membre introuvable.' });
    await supprimerMedia(rows[0].photo_public_id);
    res.json({ supprime: true });
  } catch (err) {
    next(err);
  }
});

/* ---------- Solutions ---------- */

router.get('/solutions', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM solutions ORDER BY ordre ASC, cree_le DESC');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

async function slugUnique(titre, idAExclure = null) {
  const base = genererSlug(titre);
  let slug = base;
  let n = 2;
  for (;;) {
    const { rows } = idAExclure
      ? await pool.query('SELECT id FROM solutions WHERE slug = $1 AND id != $2', [slug, idAExclure])
      : await pool.query('SELECT id FROM solutions WHERE slug = $1', [slug]);
    if (!rows.length) return slug;
    slug = `${base}-${n++}`;
  }
}

router.post('/solutions', uploadMedia.single('image'), async (req, res, next) => {
  try {
    const titre = nettoyer(req.body?.titre, 150);
    const descriptionCourte = nettoyer(req.body?.description_courte, 300);
    const description = nettoyer(req.body?.description, 5000);
    const problemeResolu = nettoyer(req.body?.probleme_resolu, 3000);
    const ordre = entier(req.body?.ordre) ?? 0;
    const enVedette = req.body?.en_vedette === 'true' || req.body?.en_vedette === true;

    const erreurs = [];
    if (titre.length < 2) erreurs.push('Donnez un titre à la solution.');
    if (erreurs.length) return res.status(400).json({ erreur: erreurs[0], erreurs });

    const slug = await slugUnique(titre);

    let image = null;
    if (req.file) image = await envoyerMedia(req.file.buffer, 'image', { mimetype: req.file.mimetype, baseUrl: urlBase(req) });

    const traductions = await traduireChamps({
      titre, description_courte: descriptionCourte, description, probleme_resolu: problemeResolu,
    });

    const { rows } = await pool.query(
      `INSERT INTO solutions
        (titre, titre_en, slug, description_courte, description_courte_en, description, description_en,
         probleme_resolu, probleme_resolu_en, ordre, en_vedette, image_url, image_public_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [
        titre, traductions.titre_en, slug,
        descriptionCourte, traductions.description_courte_en,
        description, traductions.description_en,
        problemeResolu, traductions.probleme_resolu_en,
        ordre, enVedette, image?.secure_url || null, image?.public_id || null,
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put('/solutions/:id', uploadMedia.single('image'), async (req, res, next) => {
  try {
    const id = entier(req.params.id);
    const { rows: existants } = await pool.query('SELECT * FROM solutions WHERE id = $1', [id]);
    const ancien = existants[0];
    if (!ancien) return res.status(404).json({ erreur: 'Solution introuvable.' });

    const titre = nettoyer(req.body?.titre, 150);
    const descriptionCourte = nettoyer(req.body?.description_courte, 300);
    const description = nettoyer(req.body?.description, 5000);
    const problemeResolu = nettoyer(req.body?.probleme_resolu, 3000);
    const ordre = entier(req.body?.ordre) ?? ancien.ordre;
    const enVedette = req.body?.en_vedette === 'true' || req.body?.en_vedette === true;
    const actif = !(req.body?.actif === 'false' || req.body?.actif === false);

    const erreurs = [];
    if (titre.length < 2) erreurs.push('Donnez un titre à la solution.');
    if (erreurs.length) return res.status(400).json({ erreur: erreurs[0], erreurs });

    const slug = titre === ancien.titre ? ancien.slug : await slugUnique(titre, id);

    let imageUrl = ancien.image_url;
    let imageId = ancien.image_public_id;
    let aSupprimer = null;

    if (req.file) {
      const image = await envoyerMedia(req.file.buffer, 'image', { mimetype: req.file.mimetype, baseUrl: urlBase(req) });
      aSupprimer = ancien.image_public_id;
      imageUrl = image.secure_url;
      imageId = image.public_id;
    } else if (req.body?.retirer_image === 'true') {
      aSupprimer = ancien.image_public_id;
      imageUrl = null;
      imageId = null;
    }

    const traductions = await traduireChamps({
      titre, description_courte: descriptionCourte, description, probleme_resolu: problemeResolu,
    });

    const { rows } = await pool.query(
      `UPDATE solutions SET titre=$1, titre_en=$2, slug=$3, description_courte=$4, description_courte_en=$5,
         description=$6, description_en=$7, probleme_resolu=$8, probleme_resolu_en=$9,
         ordre=$10, en_vedette=$11, actif=$12, image_url=$13, image_public_id=$14, modifie_le=NOW()
       WHERE id=$15 RETURNING *`,
      [
        titre, traductions.titre_en, slug,
        descriptionCourte, traductions.description_courte_en,
        description, traductions.description_en,
        problemeResolu, traductions.probleme_resolu_en,
        ordre, enVedette, actif, imageUrl, imageId, id,
      ]
    );
    if (aSupprimer) await supprimerMedia(aSupprimer);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/solutions/:id', async (req, res, next) => {
  try {
    const id = entier(req.params.id);
    const { rows } = await pool.query('DELETE FROM solutions WHERE id = $1 RETURNING image_public_id', [id]);
    if (!rows[0]) return res.status(404).json({ erreur: 'Solution introuvable.' });
    await supprimerMedia(rows[0].image_public_id);
    res.json({ supprime: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
