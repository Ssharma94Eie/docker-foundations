const http = require("http");
const { Pool } = require("pg");
const { createClient } = require("redis");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const redis = createClient({ url: process.env.REDIS_URL });
redis.on("error", (e) => console.error("redis error:", e.message));

// depends_on waits for the container to start, not for the service to be ready,
// so retry the first connection to Postgres and Redis.
async function withRetry(fn, label, tries = 30) {
  for (let i = 1; i <= tries; i++) {
    try {
      return await fn();
    } catch (e) {
      console.log(`waiting for ${label} (${i}/${tries}): ${e.message}`);
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  throw new Error(`${label} not ready after ${tries} tries`);
}

async function start() {
  await withRetry(() => pool.query("SELECT 1"), "postgres");
  await withRetry(() => redis.connect(), "redis");
  console.log("connected to postgres and redis");

  const server = http.createServer(async (req, res) => {
    try {
      const visits = await redis.incr("visits");
      const inserted = await pool.query(
        "INSERT INTO hits (path) VALUES ($1) RETURNING id",
        [req.url]
      );
      const total = await pool.query("SELECT COUNT(*)::int AS count FROM hits");
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify(
          {
            message: "API is talking to Postgres and Redis over the Compose network",
            redis_visits: visits,
            postgres_hit_id: inserted.rows[0].id,
            postgres_total_hits: total.rows[0].count,
          },
          null,
          2
        ) + "\n"
      );
    } catch (e) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: e.message }) + "\n");
    }
  });

  server.listen(3000, () => console.log("api listening on port 3000"));
}

start();
