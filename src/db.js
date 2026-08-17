const pg = require('pg');
require('dotenv').config();

const { Pool } = pg;

const DEFAULT_PG_PORT = 5432;
const POOL_MAX_SIZE = 5;
const IDLE_TIMEOUT_MS = 30_000;
const CONNECTION_TIMEOUT_MS = 10_000;

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: DEFAULT_PG_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
  max: POOL_MAX_SIZE,
  idleTimeoutMillis: IDLE_TIMEOUT_MS,
  connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
  allowExitOnIdle: true,
});

pool.on('error', (err) => {
  console.error('❌ Idle client error:', err.message);
});

// Health-check: verify connectivity, then release the client back to the pool.
pool.connect()
  .then((client) => {
    client.on('error', (err) => {
      console.error('❌ Client error:', err.message);
    });
    return client.query('SELECT 1')
      .then(async () => {
        console.log('✅ Connected to Postgres');
        // Auto-migration: add proof_url column if missing
        try {
          await client.query(
            "ALTER TABLE donations ADD COLUMN IF NOT EXISTS proof_url TEXT"
          );
        } catch (_) { /* table may not exist yet */ }
      })
      .finally(() => client.release());
  })
  .catch((err) => {
    console.error('❌ Connection error:', err.message);
  });

module.exports = pool;
