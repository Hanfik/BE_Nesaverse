const sql = require('../db');

const getTikTok = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let rows;
    if (category && category !== 'All' && search) {
      rows = await sql`SELECT * FROM tiktok_accounts WHERE status='active' AND category=${category} AND LOWER(title) LIKE ${'%'+search.toLowerCase()+'%'} ORDER BY id ASC`;
    } else if (category && category !== 'All') {
      rows = await sql`SELECT * FROM tiktok_accounts WHERE status='active' AND category=${category} ORDER BY id ASC`;
    } else if (search) {
      rows = await sql`SELECT * FROM tiktok_accounts WHERE status='active' AND (LOWER(title) LIKE ${'%'+search.toLowerCase()+'%'} OR LOWER(creator) LIKE ${'%'+search.toLowerCase()+'%'}) ORDER BY id ASC`;
    } else {
      rows = await sql`SELECT * FROM tiktok_accounts WHERE status='active' ORDER BY id ASC`;
    }
    res.json(rows);
  } catch (err) { next(err); }
};

const createTikTok = async (req, res, next) => {
  try {
    const { creator, title, views, likes, category, thumb, avatar, trending, duration, link } = req.body;
    const rows = await sql`INSERT INTO tiktok_accounts (creator,title,views,likes,category,thumb,avatar,trending,duration,link) VALUES (${creator},${title},${views||'0'},${likes||'0'},${category},${thumb||null},${avatar||null},${trending||false},${duration||null},${link||null}) RETURNING *`;
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

const updateTikTok = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { creator, title, views, likes, category, thumb, avatar, trending, duration, link, status } = req.body;
    const rows = await sql`UPDATE tiktok_accounts SET creator=${creator},title=${title},views=${views||'0'},likes=${likes||'0'},category=${category},thumb=${thumb||null},avatar=${avatar||null},trending=${trending||false},duration=${duration||null},link=${link||null},status=${status||'active'} WHERE id=${id} RETURNING *`;
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

const deleteTikTok = async (req, res, next) => {
  try {
    await sql`DELETE FROM tiktok_accounts WHERE id=${req.params.id}`;
    res.json({ success: true });
  } catch (err) { next(err); }
};

module.exports = { getTikTok, createTikTok, updateTikTok, deleteTikTok };
