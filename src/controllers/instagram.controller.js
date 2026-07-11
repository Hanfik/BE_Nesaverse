const pool = require('../db');

const buildFilter = (category, search) => {
  if (category && category !== 'All' && search) return { mode: 'both', category, search };
  if (category && category !== 'All') return { mode: 'category', category };
  if (search) return { mode: 'search', search };
  return { mode: 'all' };
};

const getInstagram = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const f = buildFilter(category, search);
    let result;

    if (f.mode === 'both') {
      result = await pool.query(
        "SELECT * FROM instagram_accounts WHERE status='active' AND category=$1 AND LOWER(name) LIKE $2 ORDER BY id ASC",
        [f.category, '%' + f.search.toLowerCase() + '%']
      );
    } else if (f.mode === 'category') {
      result = await pool.query(
        "SELECT * FROM instagram_accounts WHERE status='active' AND category=$1 ORDER BY id ASC",
        [f.category]
      );
    } else if (f.mode === 'search') {
      result = await pool.query(
        "SELECT * FROM instagram_accounts WHERE status='active' AND (LOWER(name) LIKE $1 OR LOWER(handle) LIKE $2) ORDER BY id ASC",
        ['%' + f.search.toLowerCase() + '%', '%' + f.search.toLowerCase() + '%']
      );
    } else {
      result = await pool.query(
        "SELECT * FROM instagram_accounts WHERE status='active' ORDER BY id ASC"
      );
    }

    res.json(result.rows);
  } catch (err) { next(err); }
};

const createInstagram = async (req, res, next) => {
  try {
    const { name, handle, avatar, followers, posts, category, bio, verified, link, gradient } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO instagram_accounts (name, handle, avatar, followers, posts, category, bio, verified, link, gradient)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [name, handle, avatar || null, followers || '0', posts || 0, category, bio || null, verified || false, link || null, gradient || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

const updateInstagram = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, handle, avatar, followers, posts, category, bio, verified, link, gradient, status } = req.body;
    const { rows } = await pool.query(
      `UPDATE instagram_accounts SET name=$1, handle=$2, avatar=$3, followers=$4, posts=$5,
        category=$6, bio=$7, verified=$8, link=$9, gradient=$10, status=$11
       WHERE id=$12 RETURNING *`,
      [name, handle, avatar || null, followers || '0', posts || 0, category, bio || null, verified || false, link || null, gradient || null, status || 'active', id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

const deleteInstagram = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM instagram_accounts WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) { next(err); }
};

module.exports = { getInstagram, createInstagram, updateInstagram, deleteInstagram };
