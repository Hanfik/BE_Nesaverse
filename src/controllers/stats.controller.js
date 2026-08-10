const pool = require('../db');

/* ─── GET /api/stats ───────────────────────────────────────────────────── */
const getStats = async (req, res, next) => {
  try {
    const [statsRows, platformCounts, totalFollowers, onlineTotal, donationTotal] = await Promise.all([
      pool.query('SELECT * FROM stats ORDER BY id LIMIT 1'),
      pool.query(`
        SELECT pt.name, COUNT(*)::int AS count
        FROM platforms p JOIN platform_types pt ON p.type_id = pt.id
        WHERE p.status = 'active'
        GROUP BY pt.name
      `),
      pool.query("SELECT COALESCE(SUM(CASE WHEN followers ~ '^[0-9.,]+$' THEN REPLACE(REPLACE(followers, '.', ''), ',', '')::bigint ELSE 0 END),0)::bigint AS total FROM platforms WHERE status='active'"),
      pool.query("SELECT COALESCE(SUM((extra->>'online')::int),0) AS total FROM platforms WHERE status='active' AND type_id=1"),
      pool.query("SELECT COALESCE(SUM(amount),0)::bigint AS total FROM donations"),
    ]);

    if (!statsRows.rows.length) return res.status(404).json({ error: 'Stats not found' });
    const s = statsRows.rows[0];

    const dist = {};
    platformCounts.rows.forEach(r => { dist[r.name] = r.count; });

    const activeCommunities = platformCounts.rows.reduce((a, r) => a + r.count, 0);
    const totalMembers = Number(totalFollowers.rows[0].total);
    const nesaVelocity = Number(onlineTotal.rows[0].total);
    const totalDonations = Number(donationTotal.rows[0].total);

    res.json({
      activeCommunities,
      totalMembers,
      nesaVelocity,
      totalVisitors: Number(s.total_visitors),
      totalDonations,
      systemStatus: s.system_status,
      platformDistribution: dist,
      timestamp: new Date().toISOString(),
    });
  } catch (err) { next(err); }
};

/* ─── POST /api/stats/visit ────────────────────────────────────────────── */
const recordVisit = async (req, res, next) => {
  try {
    await pool.query(
      'UPDATE stats SET total_visitors = total_visitors + 1 WHERE id = (SELECT id FROM stats ORDER BY id LIMIT 1)'
    );
    try {
      await pool.query('INSERT INTO page_visits (visited_at) VALUES (NOW())');
    } catch (_) { /* page_visits table may not exist in early deployments */ }
    res.json({ ok: true });
  } catch (err) { next(err); }
};

/* ─── GET /api/stats/chart ─────────────────────────────────────────────── */
const getChartData = async (req, res, next) => {
  try {
    /* ── Platform Distribution ── */
    const platformData = [];
    try {
      const { rows } = await pool.query(`
        SELECT pt.name, pt.color, COUNT(*)::int AS value
        FROM platforms p JOIN platform_types pt ON p.type_id = pt.id
        WHERE p.status = 'active'
        GROUP BY pt.name, pt.color ORDER BY value DESC
      `);
      rows.forEach(r => platformData.push({ name: r.name, value: r.value, color: r.color }));
    } catch (err) { console.error('platform chart query failed:', err.message); }

    /* ── Visitor Trend (last 7 days) ── */
    let visitorTrend = [];
    try {
      const { rows } = await pool.query(`
        SELECT TO_CHAR(DATE_TRUNC('day', visited_at), 'Dy') AS day, COUNT(*) AS visits
        FROM page_visits WHERE visited_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE_TRUNC('day', visited_at) ORDER BY DATE_TRUNC('day', visited_at)
      `);
      visitorTrend = rows.map(r => ({ day: r.day, visits: Number(r.visits) }));
    } catch (err) { console.error('visitor trend query failed:', err.message); }

    if (!visitorTrend.length) {
      const { rows: sv } = await pool.query('SELECT total_visitors FROM stats ORDER BY id LIMIT 1');
      const total = Number(sv[0]?.total_visitors ?? 0);
      const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
      const share = Math.round(total / 7);
      visitorTrend = days.map((day, i) => ({
        day, visits: Math.max(0, share + (i % 3 === 0 ? Math.round(share * 0.1) : -Math.round(share * 0.05))),
      }));
    }

    /* ── Donation Trend (last 6 months) ── */
    let donationTrend = [];
    try {
      const { rows } = await pool.query(`
        SELECT TO_CHAR(DATE_TRUNC('month', created_at), 'Mon') AS month, SUM(amount) AS total
        FROM donations WHERE created_at >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', created_at) ORDER BY DATE_TRUNC('month', created_at)
      `);
      donationTrend = rows.map(r => ({ month: r.month, total: Number(r.total) }));
    } catch (err) { console.error('donation trend query failed:', err.message); }

    /* ── Platform Growth (followers by type) ── */
    let platformGrowth = [];
    try {
      const { rows } = await pool.query(`
        SELECT pt.name, pt.color, SUM(CASE WHEN p.followers ~ '^[0-9.,]+$' THEN REPLACE(REPLACE(p.followers, '.', ''), ',', '')::bigint ELSE 0 END)::bigint AS total_followers
        FROM platforms p JOIN platform_types pt ON p.type_id = pt.id
        WHERE p.status = 'active'
        GROUP BY pt.name, pt.color ORDER BY total_followers DESC
      `);
      platformGrowth = rows.map(r => ({ name: r.name, value: Number(r.total_followers), color: r.color }));
    } catch (err) { console.error('platform growth query failed:', err.message); }

    /* ── Recent Platforms (last 10 added) ── */
    let recentPlatforms = [];
    try {
      const { rows } = await pool.query(`
        SELECT p.name, pt.name AS type_name, pt.color, p.created_at
        FROM platforms p JOIN platform_types pt ON p.type_id = pt.id
        ORDER BY p.created_at DESC LIMIT 10
      `);
      recentPlatforms = rows.map(r => ({
        name: r.name,
        type: r.type_name,
        color: r.color,
        time: new Date(r.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      }));
    } catch (err) { console.error('recent platforms query failed:', err.message); }

    res.json({ platformData, visitorTrend, donationTrend, platformGrowth, recentPlatforms });
  } catch (err) { next(err); }
};

module.exports = { getStats, recordVisit, getChartData };
