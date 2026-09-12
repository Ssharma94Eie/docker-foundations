const express = require('express');
const { Pool } = require('pg');

// Connection details come from the environment (PGHOST, PGUSER, PGPASSWORD,
// PGDATABASE, PGPORT). In Compose these point at the "db" service.
const pool = new Pool();
const app = express();
const PORT = process.env.PORT || 3000;

async function init() {
  await pool.query('CREATE TABLE IF NOT EXISTS visits (id int PRIMARY KEY, count bigint NOT NULL)');
  await pool.query('INSERT INTO visits (id, count) VALUES (1, 0) ON CONFLICT (id) DO NOTHING');
}

// Retry so the app tolerates Postgres not being ready the instant it starts.
async function initWithRetry(retries = 15) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await init();
      return;
    } catch (err) {
      console.log(`database not ready (attempt ${attempt}/${retries}): ${err.message}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  throw new Error('database not reachable after retries');
}

// Liveness/readiness probe used by the Docker HEALTHCHECK and Compose healthcheck.
app.get('/healthz', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(503).json({ status: 'error', error: err.message });
  }
});

app.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'UPDATE visits SET count = count + 1 WHERE id = 1 RETURNING count'
    );
    res.type('html').send(
      `<!doctype html><meta charset="utf-8"><title>TDM Capstone</title>` +
      `<h1>TechDevMantra Docker Foundations capstone</h1>` +
      `<p>This page has been served <strong>${rows[0].count}</strong> times.</p>` +
      `<p>Non-root container, behind Caddy, backed by Postgres.</p>`
    );
  } catch (err) {
    res.status(500).send('database error: ' + err.message);
  }
});

initWithRetry()
  .then(() => app.listen(PORT, () => console.log(`listening on ${PORT}`)))
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
