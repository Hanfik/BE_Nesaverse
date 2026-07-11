require('dotenv').config();

const express = require('express');
const cors = require('cors');

const statsRouter      = require('./routes/stats.routes');
const communitiesRouter= require('./routes/communities.routes');
const serversRouter    = require('./routes/servers.routes');
const channelsRouter   = require('./routes/channels.routes');
const instagramRouter  = require('./routes/instagram.routes');
const tiktokRouter     = require('./routes/tiktok.routes');
const youtubeRouter    = require('./routes/youtube.routes');
const robloxRouter     = require('./routes/roblox.routes');
const donationsRouter  = require('./routes/donations.routes');

const app = express();

// ── CORS ──────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json());

// ── Swagger UI (skip on Vercel — static file serving not supported) ──
if (!process.env.VERCEL) {
  const swaggerUi = require('swagger-ui-express');
  const swaggerSpec = require('./swagger');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'NesaVerse API Docs',
  }));
  app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));
}

// ── Routes ────────────────────────────────────────────────────
app.use('/api/stats',       statsRouter);
app.use('/api/communities', communitiesRouter);
app.use('/api/servers',     serversRouter);
app.use('/api/channels',    channelsRouter);
app.use('/api/instagram',   instagramRouter);
app.use('/api/tiktok',      tiktokRouter);
app.use('/api/youtube',     youtubeRouter);
app.use('/api/roblox',      robloxRouter);
app.use('/api/donations',   donationsRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// ── Error handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Backend Error:', err.message);
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
