import { SITE } from '../config/site';

const nombre2 = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nombre0 = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

export const formatUSD = (n) => `${nombre2.format(Number(n) || 0)} $`;
export const formatCDF = (n) => `${nombre0.format(Math.round(Number(n) || 0))} FC`;
export const formatNombre = (n) => nombre0.format(Math.round(Number(n) || 0));

export function formatDate(iso, options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) {
  if (!iso) return '';
  const [a, m, j] = String(iso).slice(0, 10).split('-').map(Number);
  return new Date(a, m - 1, j).toLocaleDateString('fr-FR', options);
}

export const formatHeure = (iso) =>
  new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: SITE.fuseau });

export const formatDateHeure = (iso) =>
  new Date(iso).toLocaleString('fr-FR', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: SITE.fuseau,
  });

export const aujourdhui = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: SITE.fuseau }).format(new Date());

export const CRENEAUX = {
  indifferent: 'Toute la journée',
  matin: 'Matin',
  apres_midi: 'Après-midi',
};

export const lienWhatsApp = (telephone, message = '') => {
  let chiffres = String(telephone || '').replace(/\D/g, '');
  if (chiffres.startsWith('0')) chiffres = `243${chiffres.slice(1)}`;
  return `https://wa.me/${chiffres}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
};
