CREATE TABLE IF NOT EXISTS admins (
  id            SERIAL PRIMARY KEY,
  nom           TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  mot_de_passe  TEXT NOT NULL,
  cree_le       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS produits (
  id               SERIAL PRIMARY KEY,
  type             TEXT NOT NULL CHECK (type IN ('article', 'application')),
  nom              TEXT NOT NULL,
  description      TEXT NOT NULL DEFAULT '',
  prix_usd         NUMERIC(12,2) NOT NULL CHECK (prix_usd >= 0),
  image_url        TEXT,
  image_public_id  TEXT,
  stock            INTEGER CHECK (stock IS NULL OR stock >= 0),
  en_vedette       BOOLEAN NOT NULL DEFAULT FALSE,
  actif            BOOLEAN NOT NULL DEFAULT TRUE,
  cree_le          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  modifie_le       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS commandes (
  id                SERIAL PRIMARY KEY,
  reference         TEXT NOT NULL UNIQUE,
  client_nom        TEXT NOT NULL,
  client_telephone  TEXT,
  client_email      TEXT,
  adresse           TEXT NOT NULL,
  date_rendez_vous  DATE NOT NULL,
  creneau           TEXT NOT NULL DEFAULT 'indifferent' CHECK (creneau IN ('matin', 'apres_midi', 'indifferent')),
  note              TEXT,
  total_usd         NUMERIC(12,2) NOT NULL,
  taux_cdf          NUMERIC(14,4) NOT NULL,
  total_cdf         NUMERIC(16,2) NOT NULL,
  statut            TEXT NOT NULL DEFAULT 'en_attente'
                    CHECK (statut IN ('en_attente', 'confirmee', 'livree', 'annulee')),
  cree_le           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  modifie_le        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (client_telephone IS NOT NULL OR client_email IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS lignes_commande (
  id                 SERIAL PRIMARY KEY,
  commande_id        INTEGER NOT NULL REFERENCES commandes(id) ON DELETE CASCADE,
  produit_id         INTEGER REFERENCES produits(id) ON DELETE SET NULL,
  nom_produit        TEXT NOT NULL,
  type               TEXT NOT NULL,
  prix_unitaire_usd  NUMERIC(12,2) NOT NULL,
  quantite           INTEGER NOT NULL CHECK (quantite > 0)
);

CREATE TABLE IF NOT EXISTS parametres (
  cle     TEXT PRIMARY KEY,
  valeur  TEXT
);

CREATE INDEX IF NOT EXISTS idx_produits_actif_type ON produits (actif, type);
CREATE INDEX IF NOT EXISTS idx_commandes_statut ON commandes (statut);
CREATE INDEX IF NOT EXISTS idx_commandes_rdv ON commandes (date_rendez_vous);
CREATE INDEX IF NOT EXISTS idx_lignes_commande ON lignes_commande (commande_id);
