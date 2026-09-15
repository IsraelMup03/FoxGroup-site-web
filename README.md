# FoxGroup — site web

Même structure que SNEL : deux dossiers indépendants, déployables chez des hébergeurs différents.

```
foxgroup-site/
├── backend/    API Node.js / Express  → Render (ou Railway, VPS…)
└── frontend/   React / Vite / Tailwind → Netlify (ou Vercel…)
```

Base de données : PostgreSQL (Supabase, chaîne **Session Pooler**). Images : Cloudinary.

## Fonctionnement

**Visiteur** : catalogue (applications et articles), prix en dollars avec conversion en francs, panier, commande **sans compte** : nom, téléphone ou email, adresse précise, jour du rendez-vous ou de livraison. Paiement à la livraison. Une référence `FG-AAMMJJ-XXXXXX` est donnée à la fin.

**Administrateur** (`/admin`) : tableau de bord et prochains rendez-vous, publication des produits avec image, gestion des commandes (En attente, Confirmée, Livrée, Annulée) avec boutons appel / WhatsApp / email, réglage du taux.

**Règles côté serveur**
- Les prix et totaux sont recalculés par le serveur : le navigateur ne peut pas les modifier.
- Le stock des articles baisse à la commande, revient si la commande est annulée.
- Le taux et le montant en francs sont enregistrés avec chaque commande.
- Supprimer un produit ne casse pas les anciennes commandes (le nom est conservé).

**Taux de change**
- Mode automatique : taux du marché via `open.er-api.com`, revérifié toutes les 30 minutes. Ce service publie une mise à jour par jour environ.
- Taux manuel : sert de secours si le service ne répond pas, ou remplace le marché en mode manuel.
- **Définissez un taux manuel dès l'installation**, sinon aucune commande n'est possible quand le service externe tombe.

## 1. Lancer en local (Windows / PowerShell)

Node 22 recommandé.

```powershell
# Backend
cd backend
npm install
copy .env.example .env      # puis remplissez .env
npm run init-db             # crée les tables et le compte admin
npm run dev                 # http://localhost:5000

# Frontend (autre terminal)
cd frontend
npm install
copy .env.example .env      # VITE_API_URL=http://localhost:5000
npm run dev                 # http://localhost:5173
```

Administration : http://localhost:5173/admin/connexion avec `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## 2. Supabase

1. Créez un projet.
2. **Connect** → **Session pooler** → copiez la chaîne dans `DATABASE_URL` (remplacez le mot de passe).
3. Depuis votre PC, dans `backend/` : `npm run init-db`.

## 3. Cloudinary

Dashboard → copiez `Cloud name`, `API Key`, `API Secret` dans `.env` (et sur Render).

## 4. Backend sur Render

1. New → **Web Service** → dépôt GitHub → **Root Directory : `backend`**.
2. Build : `npm install` — Start : `npm start`.
3. Variables d'environnement : toutes celles de `.env.example` sauf `PORT`.
4. `FRONTEND_URL` = l'URL Netlify **exacte**, sans slash final. Plusieurs URL : séparez par des virgules.
5. Après déploiement, testez `https://VOTRE-API.onrender.com/api/sante`.

## 5. Frontend sur Netlify

1. Add new site → dépôt GitHub → **Base directory : `frontend`**.
2. Build : `npm run build` — Publish : `frontend/dist`.
3. Variable : `VITE_API_URL` = URL Render **exacte** (copiez-la depuis Render, ne la retapez pas).
4. Redéployez après chaque changement de variable.

`public/_redirects` (Netlify) et `vercel.json` (Vercel) évitent les erreurs 404 en rafraîchissant une page.

## À personnaliser

- `frontend/src/config/site.js` : téléphone, WhatsApp, email, ville.
- `frontend/src/index.css` (bloc `@theme`) : couleurs.

## Problèmes connus

| Symptôme | Cause probable |
|---|---|
| « Serveur injoignable » | `VITE_API_URL` incorrecte, ou Render en veille (premier appel lent sur l'offre gratuite) |
| « Origine non autorisée par CORS » | `FRONTEND_URL` sur Render ne correspond pas exactement à l'URL Netlify |
| « Aucun taux disponible » | Définissez un taux manuel dans Administration → Taux de change |
| Erreur à l'envoi d'image | Clés Cloudinary absentes ou fausses |
| DNS / connexion Supabase | Utilisez la chaîne Session Pooler |
