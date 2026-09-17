CREATE TABLE IF NOT EXISTS admins (
  id            SERIAL PRIMARY KEY,
  nom           TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  mot_de_passe  TEXT NOT NULL,
  cree_le       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS equipe (
  id               SERIAL PRIMARY KEY,
  nom              TEXT NOT NULL,
  role             TEXT NOT NULL,
  role_en          TEXT,
  bio              TEXT NOT NULL DEFAULT '',
  bio_en           TEXT,
  photo_url        TEXT,
  photo_public_id  TEXT,
  ordre            INTEGER NOT NULL DEFAULT 0,
  actif            BOOLEAN NOT NULL DEFAULT TRUE,
  cree_le          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS solutions (
  id                     SERIAL PRIMARY KEY,
  titre                  TEXT NOT NULL,
  titre_en               TEXT,
  slug                   TEXT NOT NULL UNIQUE,
  description_courte     TEXT NOT NULL DEFAULT '',
  description_courte_en  TEXT,
  description            TEXT NOT NULL DEFAULT '',
  description_en         TEXT,
  probleme_resolu        TEXT NOT NULL DEFAULT '',
  probleme_resolu_en     TEXT,
  image_url              TEXT,
  image_public_id        TEXT,
  en_vedette             BOOLEAN NOT NULL DEFAULT FALSE,
  actif                  BOOLEAN NOT NULL DEFAULT TRUE,
  ordre                  INTEGER NOT NULL DEFAULT 0,
  cree_le                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  modifie_le             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_equipe_actif_ordre ON equipe (actif, ordre);
CREATE INDEX IF NOT EXISTS idx_solutions_actif_ordre ON solutions (actif, ordre);

-- Ajout des colonnes de traduction anglaise sur une base déjà existante
-- (CREATE TABLE IF NOT EXISTS ne modifie pas une table déjà créée).
ALTER TABLE equipe ADD COLUMN IF NOT EXISTS role_en TEXT;
ALTER TABLE equipe ADD COLUMN IF NOT EXISTS bio_en TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS titre_en TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS description_courte_en TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS probleme_resolu_en TEXT;
