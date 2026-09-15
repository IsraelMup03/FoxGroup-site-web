const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const pool = require('../config/db');
const { obtenirTaux } = require('../services/taux');
const { nettoyer, aujourdhui, genererReference, entier } = require('../services/utils');

const limiteCommandes = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 15,
  message: { erreur: 'Trop de commandes envoyées. Réessayez dans quelques minutes.' },
});

const CRENEAUX = ['matin', 'apres_midi', 'indifferent'];

function valider(corps) {
  const donnees = {
    nom: nettoyer(corps.nom, 120),
    telephone: nettoyer(corps.telephone, 30),
    email: nettoyer(corps.email, 160).toLowerCase(),
    adresse: nettoyer(corps.adresse, 500),
    date: nettoyer(corps.date_rendez_vous, 10),
    creneau: CRENEAUX.includes(corps.creneau) ? corps.creneau : 'indifferent',
    note: nettoyer(corps.note, 1000),
  };

  const erreurs = [];
  if (donnees.nom.length < 2) erreurs.push('Indiquez votre nom.');
  if (!donnees.telephone && !donnees.email) {
    erreurs.push('Indiquez un numéro de téléphone ou une adresse email.');
  }
  if (donnees.telephone && !/^\+?[0-9\s-]{8,20}$/.test(donnees.telephone)) {
    erreurs.push('Le numéro de téléphone doit contenir au moins 8 chiffres.');
  }
  if (donnees.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donnees.email)) {
    erreurs.push("L'adresse email n'est pas valide.");
  }
  if (donnees.adresse.length < 10) {
    erreurs.push("Précisez l'adresse : commune, quartier, avenue et numéro.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(donnees.date) || donnees.date < aujourdhui()) {
    erreurs.push("Choisissez une date de rendez-vous à partir d'aujourd'hui.");
  }

  const quantites = new Map();
  for (const ligne of Array.isArray(corps.articles) ? corps.articles : []) {
    const id = entier(ligne?.produit_id);
    const q = entier(ligne?.quantite);
    if (id > 0 && q > 0 && q <= 100) quantites.set(id, (quantites.get(id) || 0) + q);
  }
  if (!quantites.size) erreurs.push('Votre panier est vide.');

  return { donnees, quantites, erreurs };
}

router.post('/', limiteCommandes, async (req, res, next) => {
  const { donnees, quantites, erreurs } = valider(req.body || {});
  if (erreurs.length) return res.status(400).json({ erreur: erreurs[0], erreurs });

  let taux;
  try {
    ({ taux } = await obtenirTaux());
  } catch (err) {
    if (!err.public) return next(err);
    return res.status(503).json({ erreur: 'Commande impossible pour le moment : taux de change indisponible. Réessayez plus tard.' });
  }

  const client = await pool.connect();
  const refuser = async (statut, message) => {
    await client.query('ROLLBACK');
    return res.status(statut).json({ erreur: message });
  };

  try {
    await client.query('BEGIN');

    const ids = [...quantites.keys()];
    const { rows: produits } = await client.query(
      'SELECT id, nom, type, prix_usd, stock, actif FROM produits WHERE id = ANY($1::int[]) FOR UPDATE',
      [ids]
    );

    if (produits.length !== ids.length || produits.some((p) => !p.actif)) {
      return refuser(409, "Un produit de votre panier n'est plus disponible. Mettez votre panier à jour.");
    }

    let totalCentimes = 0;
    for (const p of produits) {
      const q = quantites.get(p.id);
      if (p.stock !== null && p.stock < q) {
        return refuser(409, `Stock insuffisant pour « ${p.nom} » : ${p.stock} disponible(s).`);
      }
      totalCentimes += Math.round(Number(p.prix_usd) * 100) * q;
    }

    const totalUsd = totalCentimes / 100;
    const totalCdf = Math.round(totalUsd * taux);
    const reference = genererReference();

    const { rows } = await client.query(
      `INSERT INTO commandes
        (reference, client_nom, client_telephone, client_email, adresse, date_rendez_vous,
         creneau, note, total_usd, taux_cdf, total_cdf)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
      [
        reference, donnees.nom, donnees.telephone || null, donnees.email || null, donnees.adresse,
        donnees.date, donnees.creneau, donnees.note || null, totalUsd, taux, totalCdf,
      ]
    );
    const commandeId = rows[0].id;

    for (const p of produits) {
      const q = quantites.get(p.id);
      await client.query(
        `INSERT INTO lignes_commande (commande_id, produit_id, nom_produit, type, prix_unitaire_usd, quantite)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [commandeId, p.id, p.nom, p.type, p.prix_usd, q]
      );
      if (p.stock !== null) {
        await client.query('UPDATE produits SET stock = stock - $1 WHERE id = $2', [q, p.id]);
      }
    }

    await client.query('COMMIT');

    res.status(201).json({
      reference,
      total_usd: totalUsd,
      taux_cdf: taux,
      total_cdf: totalCdf,
      date_rendez_vous: donnees.date,
      creneau: donnees.creneau,
      articles: produits.map((p) => ({
        nom: p.nom, type: p.type, quantite: quantites.get(p.id), prix_unitaire_usd: Number(p.prix_usd),
      })),
    });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    next(err);
  } finally {
    client.release();
  }
});

module.exports = router;
