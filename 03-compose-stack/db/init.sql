-- Runs once, the first time the Postgres data volume is created.
CREATE TABLE IF NOT EXISTS hits (
  id SERIAL PRIMARY KEY,
  path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
