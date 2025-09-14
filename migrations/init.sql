
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(30) DEFAULT 'user',
  level INTEGER DEFAULT 1,
  preferred_language VARCHAR(10) DEFAULT 'ru',
  preferred_currency VARCHAR(10) DEFAULT 'KZT',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cargos (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  origin_country VARCHAR(10),
  origin_city VARCHAR(100),
  dest_country VARCHAR(10),
  dest_city VARCHAR(100),
  weight NUMERIC,
  price NUMERIC,
  currency VARCHAR(10),
  status VARCHAR(30) DEFAULT 'new',
  map_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS driver_locations (
  id SERIAL PRIMARY KEY,
  driver_id INTEGER,
  cargo_id INTEGER,
  lat NUMERIC,
  lon NUMERIC,
  speed NUMERIC,
  timestamp TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  from_user_id INTEGER,
  to_user_id INTEGER,
  cargo_id INTEGER,
  text TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);
