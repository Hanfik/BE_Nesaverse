require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { verifyToken } = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const requestLogger = require('./middleware/requestLogger');

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

// ── Middleware ─────────────────────────────────────────────────
app.use(requestLogger);
app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
}));
app.use(express.json());

// ── Swagger UI (skip on Vercel) ───────────────────────────────
if (!process.env.VERCEL) {
  const swaggerUi = require('swagger-ui-express');
  const swaggerSpec = require('./swagger');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'NesaVerse API Docs',
  }));
  app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));
}

// ── Root ──────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('Backend berjalan dengan PostgreSQL');
});

// ── Public Routes (GET only) ──────────────────────────────────
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

// ── 404 & Error Handler ──────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
