-- patches/migrations_additions.sql
-- Run this on your PostgreSQL database (psql) to add news, vacancies, tariffs, payments summary tables
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_published BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS vacancies (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    salary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS tariffs (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT,
    starts_with CHAR(1),
    price NUMERIC(12,2),
    active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER,
    amount NUMERIC(12,2),
    currency TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    status TEXT
);
