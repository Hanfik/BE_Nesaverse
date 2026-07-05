const express = require('express');
const cors = require('cors');

const statsRouter = require('./routes/stats.routes');
const communitiesRouter = require('./routes/communities.routes');
const serversRouter = require('./routes/servers.routes');
const channelsRouter = require('./routes/channels.routes');

const app = express();

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'] }));
app.use(express.json());

// Routes
app.use('/api/stats', statsRouter);
app.use('/api/communities', communitiesRouter);
app.use('/api/servers', serversRouter);
app.use('/api/channels', channelsRouter);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
