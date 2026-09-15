const crypto = require('crypto');

const nettoyer = (valeur, max = 255) =>
  typeof valeur === 'string' ? valeur.trim().slice(0, max) : '';

const aujourdhui = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: process.env.FUSEAU || 'Africa/Kinshasa' }).format(new Date());

const genererReference = () => {
  const d = aujourdhui().replace(/-/g, '').slice(2);
  return `FG-${d}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
};

const entier = (valeur) => {
  const n = Number.parseInt(valeur, 10);
  return Number.isInteger(n) ? n : null;
};

const normaliserProduit = (p) => ({ ...p, prix_usd: Number(p.prix_usd) });

module.exports = { nettoyer, aujourdhui, genererReference, entier, normaliserProduit };
