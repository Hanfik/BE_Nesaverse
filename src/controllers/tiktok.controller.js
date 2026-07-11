const pool = require('../db');

const getTikTok = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let result;

    if (category && category !== 'All' && search) {
      result = await pool.query(
        "SELECT * FROM tiktok_accounts WHERE status='active' AND category=$1 AND LOWER(title) LIKE $2 ORDER BY id ASC",
        [category, '%' + search.toLowerCase() + '%']
      );
    } else if (category && category !== 'All') {
      result = await pool.query(
        "SELECT * FROM tiktok_accounts WHERE status='active' AND category=$1 ORDER BY id ASC",
        [category]
      );
    } else if (search) {
      result = await pool.query(
        "SELECT * FROM tiktok_accounts WHERE status='active' AND (LOWER(title) LIKE $1 OR LOWER(creator) LIKE $2) ORDER BY id ASC",
        ['%' + search.toLowerCase() + '%', '%' + search.toLowerCase() + '%']
      );
    } else {
      result = await pool.query(
        "SELECT * FROM tiktok_accounts WHERE status='active' ORDER BY id ASC"
      );
    }

    res.json(result.rows);
  } catch (err) { next(err); }
};

const createTikTok = async (req, res, next) => {
  try {
    const { creator, title, views, likes, category, thumb, avatar, trending, duration, link } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO tiktok_accounts (creator, title, views, likes, category, thumb, avatar, trending, duration, link)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [creator, title, views || '0', likes || '0', category, thumb || null, avatar || null, trending || false, duration || null, link || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

const updateTikTok = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { creator, title, views, likes, category, thumb, avatar, trending, duration, link, status } = req.body;
    const { rows } = await pool.query(
      `UPDATE tiktok_accounts SET creator=$1, title=$2, views=$3, likes=$4, category=$5,
        thumb=$6, avatar=$7, trending=$8, duration=$9, link=$10, status=$11
       WHERE id=$12 RETURNING *`,
      [creator, title, views || '0', likes || '0', category, thumb || null, avatar || null, trending || false, duration || null, link || null, status || 'active', id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

const deleteTikTok = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM tiktok_accounts WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { next(err); }
};

module.exports = { getTikTok, createTikTok, updateTikTok, deleteTikTok };
