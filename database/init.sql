-- ============================================================
-- Luxury Watch Collection Control — Database Schema
-- PostgreSQL 15
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE watch_condition AS ENUM (
  'mint',
  'excellent',
  'very_good',
  'good',
  'fair',
  'poor'
);

CREATE TYPE movement_type AS ENUM (
  'automatic',
  'manual',
  'quartz',
  'solar',
  'kinetic',
  'spring_drive',
  'other'
);

CREATE TYPE gender_type AS ENUM (
  'mens',
  'womens',
  'unisex'
);

CREATE TYPE acquisition_type AS ENUM (
  'purchased',
  'gifted',
  'inherited',
  'traded',
  'other'
);

-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE users (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- BRANDS
-- ============================================================

CREATE TABLE brands (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(150) NOT NULL UNIQUE,
  country     VARCHAR(100),
  founded_year INTEGER,
  website     TEXT,
  logo_url    TEXT,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- COLLECTIONS
-- ============================================================

CREATE TABLE collections (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        VARCHAR(150) NOT NULL,
  description TEXT,
  is_public   BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- WATCH MOVEMENTS (reference data)
-- ============================================================

CREATE TABLE watch_movements (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  caliber         VARCHAR(100)  NOT NULL,
  movement_type   movement_type NOT NULL,
  brand_id        UUID          REFERENCES brands(id) ON DELETE SET NULL,
  power_reserve_h INTEGER,
  frequency_hz    NUMERIC(6,2),
  jewels          INTEGER,
  description     TEXT,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- WATCHES
-- ============================================================

CREATE TABLE watches (
  id                UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID             NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand_id          UUID             NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  collection_id     UUID             REFERENCES collections(id) ON DELETE SET NULL,
  movement_id       UUID             REFERENCES watch_movements(id) ON DELETE SET NULL,
  model             VARCHAR(200)     NOT NULL,
  reference_number  VARCHAR(100),
  serial_number     VARCHAR(100),
  year_manufactured INTEGER,
  dial_color        VARCHAR(80),
  case_material     VARCHAR(100),
  case_diameter_mm  NUMERIC(5,2),
  bracelet_material VARCHAR(100),
  water_resistance_m INTEGER,
  gender            gender_type      NOT NULL DEFAULT 'unisex',
  condition         watch_condition  NOT NULL DEFAULT 'excellent',
  acquisition_type  acquisition_type NOT NULL DEFAULT 'purchased',
  acquisition_date  DATE,
  acquisition_price NUMERIC(14,2),
  acquisition_currency VARCHAR(3)   DEFAULT 'USD',
  current_value     NUMERIC(14,2),
  notes             TEXT,
  is_for_sale       BOOLEAN          NOT NULL DEFAULT FALSE,
  asking_price      NUMERIC(14,2),
  created_at        TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- ============================================================
-- WATCH IMAGES
-- ============================================================

CREATE TABLE watch_images (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  watch_id   UUID        NOT NULL REFERENCES watches(id) ON DELETE CASCADE,
  url        TEXT        NOT NULL,
  caption    VARCHAR(255),
  is_primary BOOLEAN     NOT NULL DEFAULT FALSE,
  sort_order INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SERVICE RECORDS
-- ============================================================

CREATE TABLE service_records (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  watch_id        UUID        NOT NULL REFERENCES watches(id) ON DELETE CASCADE,
  service_date    DATE        NOT NULL,
  service_type    VARCHAR(150) NOT NULL,
  service_center  VARCHAR(200),
  technician      VARCHAR(150),
  cost            NUMERIC(12,2),
  currency        VARCHAR(3)  DEFAULT 'USD',
  description     TEXT,
  next_service_date DATE,
  warranty_until  DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- VALUATIONS
-- ============================================================

CREATE TABLE valuations (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  watch_id        UUID        NOT NULL REFERENCES watches(id) ON DELETE CASCADE,
  valuation_date  DATE        NOT NULL,
  appraiser       VARCHAR(200),
  market_value    NUMERIC(14,2) NOT NULL,
  currency        VARCHAR(3)  DEFAULT 'USD',
  source          VARCHAR(200),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_watches_user_id       ON watches(user_id);
CREATE INDEX idx_watches_brand_id      ON watches(brand_id);
CREATE INDEX idx_watches_collection_id ON watches(collection_id);
CREATE INDEX idx_collections_user_id   ON collections(user_id);
CREATE INDEX idx_service_records_watch ON service_records(watch_id);
CREATE INDEX idx_valuations_watch      ON valuations(watch_id);
CREATE INDEX idx_watch_images_watch    ON watch_images(watch_id);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_watches_updated_at
  BEFORE UPDATE ON watches
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_service_records_updated_at
  BEFORE UPDATE ON service_records
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_valuations_updated_at
  BEFORE UPDATE ON valuations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_watch_movements_updated_at
  BEFORE UPDATE ON watch_movements
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- SEED DATA — Brands
-- ============================================================

INSERT INTO brands (name, country, founded_year, website, description) VALUES
  ('Rolex',          'Switzerland', 1905, 'https://www.rolex.com',       'Iconic Swiss luxury watchmaker known for precision and prestige.'),
  ('Patek Philippe', 'Switzerland', 1839, 'https://www.patek.com',       'One of the oldest and most prestigious watch manufacturers.'),
  ('Audemars Piguet','Switzerland', 1875, 'https://www.audemarspiguet.com','Maker of the legendary Royal Oak.'),
  ('Omega',          'Switzerland', 1848, 'https://www.omegawatches.com', 'Official timekeeper of the Olympic Games.'),
  ('IWC Schaffhausen','Switzerland',1868, 'https://www.iwc.com',         'Engineering excellence from Schaffhausen.'),
  ('Jaeger-LeCoultre','Switzerland',1833, 'https://www.jaeger-lecoultre.com','Manufacturer of the Reverso and Atmos clock.'),
  ('A. Lange & Söhne','Germany',    1845, 'https://www.alange-soehne.com','Finest German watchmaking tradition.'),
  ('Vacheron Constantin','Switzerland',1755,'https://www.vacheron-constantin.com','The world''s oldest watch manufacturer in continuous operation.'),
  ('Cartier',        'France',      1847, 'https://www.cartier.com',     'Luxury jeweller and watchmaker from Paris.'),
  ('Breitling',      'Switzerland', 1884, 'https://www.breitling.com',   'Specialist in aviation and professional watches.');
