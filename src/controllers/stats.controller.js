const sql = require('../db');

// Simulate realtime fluctuation on top of DB values
function fluctuate(base, range) {
  return base + Math.floor(Math.random() * range) - Math.floor(range / 2);
}

const getStats = async (req, res, next) => {
  try {
    // Fetch base stats from DB (always row id=1)
    const rows = await sql`SELECT * FROM stats ORDER BY id LIMIT 1`;

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Stats not found' });
    }

    const s = rows[0];

    // Apply realtime fluctuation on top of stored values
    res.json({
      communities:       fluctuate(s.communities,    10),
      members:           fluctuate(s.members,        500),
      accounts:          fluctuate(s.accounts,       50),
      servers:           fluctuate(s.servers,        5),
      totalVisitors:     fluctuate(s.total_visitors, 1000),
      activeCommunities: fluctuate(s.communities,    50),
      nesaVelocity:      fluctuate(s.nesa_velocity,  30),
      viralIndex:        (parseFloat(s.viral_index) + (Math.random() * 0.6 - 0.3)).toFixed(1),
      systemStatus:      s.system_status,
      timestamp:         new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats };
