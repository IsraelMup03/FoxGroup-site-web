export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

export async function api(chemin, { methode = 'GET', corps, formulaire, token } = {}) {
  const headers = {};
  let body;

  if (formulaire) {
    body = formulaire;
  } else if (corps !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(corps);
  }
  if (token) headers.Authorization = `Bearer ${token}`;

  let reponse;
  try {
    reponse = await fetch(API_URL + chemin, { method: methode, headers, body });
  } catch {
    const err = new Error('Serveur injoignable. Vérifiez votre connexion internet.');
    err.status = 0;
    throw err;
  }

  const donnees = await reponse.json().catch(() => null);
  if (!reponse.ok) {
    const err = new Error(donnees?.erreur || `Erreur ${reponse.status}`);
    err.status = reponse.status;
    throw err;
  }
  return donnees;
}
