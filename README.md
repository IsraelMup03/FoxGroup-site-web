# FoxGroup — site web

Site vitrine **statique** (React / Vite / Tailwind) présentant FoxGroup : qui nous sommes, nos expertises, notre solution EcolePay, nos engagements, et le contact.

```
foxgroup-site/
├── backend/    Placeholder Express, actuellement inutilisé (aucune page n'appelle d'API)
└── frontend/   Le site (React / Vite / Tailwind) → Netlify (ou Vercel…)
```

Il n'y a plus d'administration, de base de données ni de compte à gérer : tout le contenu est écrit directement dans `frontend/src/config/site.js` et modifié en éditant ce fichier.

Le dossier `backend/` ne sert plus à rien pour le moment (aucune route, aucune dépendance métier) ; il est laissé en place au cas où vous auriez besoin plus tard d'un serveur (ex. un formulaire de contact qui envoie un email). Vous pouvez le supprimer entièrement si vous êtes sûr de ne pas en avoir besoin.

## Lancer en local (Windows / PowerShell)

Node 22 recommandé.

```powershell
cd frontend
npm install
npm run dev      # http://localhost:5173
```

## Déploiement (Netlify ou Vercel)

1. Add new site → dépôt GitHub → **Base directory : `frontend`**.
2. Build : `npm run build` — Publish : `frontend/dist`.

`public/_redirects` (Netlify) et `vercel.json` (Vercel) évitent les erreurs 404 en rafraîchissant une page.

## À personnaliser

- `frontend/src/config/site.js` : téléphone, WhatsApp, Facebook, Instagram, présentation, services, EcolePay, engagements — **tout le texte du site**.
- `frontend/public/logo.png` : le vrai logo (fond transparent). `frontend/src/components/Logo.jsx` l'affiche sur un petit fond blanc arrondi, pour rester lisible aussi bien sur les sections claires que sombres du site.
- `frontend/src/index.css` (bloc `@theme`) : couleurs.
