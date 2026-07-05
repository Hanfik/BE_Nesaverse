const statsData = require('../data/stats.json');

// Simulate realtime fluctuation for admin dashboard
function getRealtimeStats() {
  const fluctuate = (base, range) => base + Math.floor(Math.random() * range) - Math.floor(range / 2);
  return {
    communities: fluctuate(statsData.communities, 10),
    members: fluctuate(statsData.members, 500),
    accounts: fluctuate(statsData.accounts, 50),
    servers: fluctuate(statsData.servers, 5),
    totalVisitors: fluctuate(4892103, 1000),
    activeCommunities: fluctuate(12402, 50),
    nesaVelocity: fluctuate(842, 30),
    viralIndex: (9.2 + (Math.random() * 0.6 - 0.3)).toFixed(1),
    systemStatus: 'online',
    timestamp: new Date().toISOString(),
  };
}

const getStats = (req, res) => {
  res.json(getRealtimeStats());
};

module.exports = { getStats };
