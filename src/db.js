const pg = require('pg');
require('dotenv').config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect()
  .then(() => console.log('✅ Connected to Postgres'))
  .catch((err) => console.error('❌ Connection error:', err.message));

module.exports = pool;
