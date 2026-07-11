const pool = require('../db');

function fluctuate(base, range) {
  return Math.max(0, base + Math.floor(Math.random() * range) - Math.floor(range / 2));
}

const getStats = async (req, res, next) => {
  try {
    const [statsRows, igCount, ttCount, ytCount, rbCount, srvCount, chCount] = await Promise.all([
      pool.query('SELECT * FROM stats ORDER BY id LIMIT 1'),
      pool.query("SELECT COUNT(*) AS c FROM instagram_accounts WHERE status='active'"),
      pool.query("SELECT COUNT(*) AS c FROM tiktok_accounts WHERE status='active'"),
      pool.query("SELECT COUNT(*) AS c FROM youtube_channels WHERE status='active'"),
      pool.query("SELECT COUNT(*) AS c FROM roblox_games WHERE status='active'"),
      pool.query("SELECT COUNT(*) AS c FROM servers WHERE status='active'"),
      pool.query("SELECT COUNT(*) AS c FROM channels WHERE status='active'"),
    ]);

    if (!statsRows.rows.length) return res.status(404).json({ error: 'Stats not found' });
    const s = statsRows.rows[0];

    const dist = {
      discord:   Number(srvCount.rows[0].c),
      whatsapp:  Number(chCount.rows[0].c),
      instagram: Number(igCount.rows[0].c),
      tiktok:    Number(ttCount.rows[0].c),
      youtube:   Number(ytCount.rows[0].c),
      roblox:    Number(rbCount.rows[0].c),
    };
    const activeCommunities = Object.values(dist).reduce((a, b) => a + b, 0);

    res.json({
      communities:        fluctuate(s.communities, 10),
      members:            fluctuate(s.members, 500),
      accounts:           fluctuate(s.accounts, 50),
      servers:            fluctuate(s.servers, 5),
      totalVisitors:      Number(s.total_visitors),
      activeCommunities:  fluctuate(activeCommunities, 3),
      nesaVelocity:       fluctuate(Number(s.nesa_velocity), 30),
      viralIndex:         (parseFloat(s.viral_index) + (Math.random() * 0.4 - 0.2)).toFixed(1),
      systemStatus:       s.system_status,
      totalPlatforms:     6,
      platformDistribution: dist,
      timestamp:          new Date().toISOString(),
    });
  } catch (err) { next(err); }
};

const recordVisit = async (req, res, next) => {
  try {
    await pool.query('UPDATE stats SET total_visitors = total_visitors + 1 WHERE id = (SELECT id FROM stats ORDER BY id LIMIT 1)');
    try {
      await pool.query('INSERT INTO page_visits (visited_at) VALUES (NOW())');
    } catch (_) { /* table may not exist yet */ }
    res.json({ ok: true });
  } catch (err) { next(err); }
};

const getChartData = async (req, res, next) => {
  try {
    const [igCount, ttCount, ytCount, rbCount, srvCount, chCount] = await Promise.all([
      pool.query("SELECT COUNT(*) AS c FROM instagram_accounts WHERE status='active'"),
      pool.query("SELECT COUNT(*) AS c FROM tiktok_accounts WHERE status='active'"),
      pool.query("SELECT COUNT(*) AS c FROM youtube_channels WHERE status='active'"),
      pool.query("SELECT COUNT(*) AS c FROM roblox_games WHERE status='active'"),
      pool.query("SELECT COUNT(*) AS c FROM servers WHERE status='active'"),
      pool.query("SELECT COUNT(*) AS c FROM channels WHERE status='active'"),
    ]);

    const platformData = [
      { name: 'Discord',   value: Number(srvCount.rows[0].c), color: '#5865F2' },
      { name: 'WhatsApp',  value: Number(chCount.rows[0].c),  color: '#25D366' },
      { name: 'Instagram', value: Number(igCount.rows[0].c),  color: '#E1306C' },
      { name: 'TikTok',    value: Number(ttCount.rows[0].c),  color: '#010101' },
      { name: 'YouTube',   value: Number(ytCount.rows[0].c),  color: '#FF0000' },
      { name: 'Roblox',    value: Number(rbCount.rows[0].c),  color: '#00A2FF' },
    ];

    let visitorTrend = [];
    try {
      const { rows } = await pool.query(`
        SELECT
          TO_CHAR(DATE_TRUNC('day', visited_at), 'Dy') AS day,
          COUNT(*) AS visits
        FROM page_visits
        WHERE visited_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE_TRUNC('day', visited_at)
        ORDER BY DATE_TRUNC('day', visited_at)
      `);
      visitorTrend = rows.map(r => ({ day: r.day, visits: Number(r.visits) }));
    } catch (_) { /* table may not exist */ }

    if (!visitorTrend.length) {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      visitorTrend = days.map((day, i) => ({
        day,
        visits: 120 + i * 30 + Math.floor(Math.random() * 40),
      }));
    }

    let donationTrend = [];
    try {
      const { rows } = await pool.query(`
        SELECT
          TO_CHAR(DATE_TRUNC('month', created_at), 'Mon') AS month,
          SUM(amount) AS total
        FROM donations
        WHERE created_at >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY DATE_TRUNC('month', created_at)
      `);
      donationTrend = rows.map(r => ({ month: r.month, total: Number(r.total) }));
    } catch (_) { /* ignore */ }

    res.json({ platformData, visitorTrend, donationTrend });
  } catch (err) { next(err); }
};

module.exports = { getStats, recordVisit, getChartData };
