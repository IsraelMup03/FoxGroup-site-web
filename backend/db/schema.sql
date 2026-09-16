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
  bio              TEXT NOT NULL DEFAULT '',
  photo_url        TEXT,
  photo_public_id  TEXT,
  ordre            INTEGER NOT NULL DEFAULT 0,
  actif            BOOLEAN NOT NULL DEFAULT TRUE,
  cree_le          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS solutions (
  id                  SERIAL PRIMARY KEY,
  titre               TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  description_courte  TEXT NOT NULL DEFAULT '',
  description         TEXT NOT NULL DEFAULT '',
  probleme_resolu     TEXT NOT NULL DEFAULT '',
  image_url           TEXT,
  image_public_id     TEXT,
  en_vedette          BOOLEAN NOT NULL DEFAULT FALSE,
  actif               BOOLEAN NOT NULL DEFAULT TRUE,
  ordre               INTEGER NOT NULL DEFAULT 0,
  cree_le             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  modifie_le          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_equipe_actif_ordre ON equipe (actif, ordre);
CREATE INDEX IF NOT EXISTS idx_solutions_actif_ordre ON solutions (actif, ordre);
