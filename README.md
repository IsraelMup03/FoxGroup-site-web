# FoxGroup — site web

Site vitrine **statique** (React / Vite / Tailwind) présentant FoxGroup : qui nous sommes, nos expertises, notre méthode de travail, nos engagements, et le contact.

```
foxgroup-site/
├── backend/    Placeholder Express, actuellement inutilisé (aucune page n'appelle d'API)
└── frontend/   Le site (React / Vite / Tailwind) → Netlify (ou Vercel…)
```

Il n'y a plus d'administration, de base de données ni de compte à gérer : tout le contenu est écrit directement dans le code et modifié en éditant des fichiers.

Le site est disponible en **français** (langue par défaut), **anglais** et **lingala**, via le sélecteur FR / EN / LN dans le menu. Le choix du visiteur est mémorisé (localStorage) pour ses visites suivantes.

Le dossier `backend/` ne sert plus à rien pour le moment (aucune route, aucune dépendance métier) ; il est laissé en place au cas où vous auriez besoin plus tard d'un serveur (ex. un formulaire de contact qui envoie un email). Vous pouvez le supprimer entièrement si vous êtes sûr de ne pas en avoir besoin.

## Lancer en local (Windows / PowerShell)

Node 22 recommandé.

```powershell
cd frontend
npm install
npm run dev      # http://localhost:5173
```

## Déploiement sur Netlify

Le dépôt GitHub est déjà lié (`IsraelMup03/FoxGroup-site-web`), donc chaque `git push` sur `main` peut déclencher un déploiement automatique une fois Netlify branché dessus.

1. Sur [app.netlify.com](https://app.netlify.com), **Add new site → Import an existing project → Deploy with GitHub**, autorisez l'accès puis choisissez le dépôt `FoxGroup-site-web`.
2. Dans les réglages de build :
   - **Base directory** : `frontend`
   - **Build command** : `npm run build`
   - **Publish directory** : `dist` (relatif au dossier de base, donc `frontend/dist` au final — ne pas retaper `frontend/dist` ici)
3. Aucune variable d'environnement à ajouter : le site est 100 % statique, il n'appelle aucune API.
4. **Deploy site**. Netlify donne une URL du type `https://un-nom-au-hasard.netlify.app`. Renommable ensuite dans *Site configuration → Change site name*, ou reliable à un nom de domaine à vous dans *Domain management*.

`public/_redirects` évite les erreurs 404 quand on rafraîchit une page qui n'est pas la racine.

## À personnaliser

- `frontend/src/i18n/traductions.js` : **tout le texte du site**, dans les 3 langues (fr / en / ln).
- `frontend/src/config/site.js` : téléphone, WhatsApp, Facebook, Instagram — coordonnées indépendantes de la langue.
- `frontend/public/logo.png` : le vrai logo (fond transparent). `frontend/src/components/Logo.jsx` l'affiche sur un petit fond blanc arrondi, pour rester lisible aussi bien sur les sections claires que sombres du site.
- `frontend/src/index.css` (bloc `@theme`) : couleurs.

## À propos du lingala

La traduction en lingala mélange volontairement des mots français pour les notions techniques (numérique, application, gestion...), comme à l'oral à Kinshasa. Elle a été écrite avec soin mais n'a pas été relue par une personne lingalaphone native — avant publication définitive, faites-la vérifier par quelqu'un qui parle couramment lingala. Le texte à relire est dans `frontend/src/i18n/traductions.js`, section `ln`.
