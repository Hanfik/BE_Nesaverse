const pool = require('../db');

const getYouTube = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let result;

    if (category && category !== 'All' && search) {
      result = await pool.query(
        "SELECT * FROM youtube_channels WHERE status='active' AND category=$1 AND LOWER(name) LIKE $2 ORDER BY id ASC",
        [category, '%' + search.toLowerCase() + '%']
      );
    } else if (category && category !== 'All') {
      result = await pool.query(
        "SELECT * FROM youtube_channels WHERE status='active' AND category=$1 ORDER BY id ASC",
        [category]
      );
    } else if (search) {
      result = await pool.query(
        "SELECT * FROM youtube_channels WHERE status='active' AND LOWER(name) LIKE $1 ORDER BY id ASC",
        ['%' + search.toLowerCase() + '%']
      );
    } else {
      result = await pool.query(
        "SELECT * FROM youtube_channels WHERE status='active' ORDER BY id ASC"
      );
    }

    res.json(result.rows);
  } catch (err) { next(err); }
};

const createYouTube = async (req, res, next) => {
  try {
    const { name, thumbnail, subscribers, description, link, category } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO youtube_channels (name, thumbnail, subscribers, description, link, category)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, thumbnail || null, subscribers || '0', description || null, link, category]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

const updateYouTube = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, thumbnail, subscribers, description, link, category, status } = req.body;
    const { rows } = await pool.query(
      `UPDATE youtube_channels SET name=$1, thumbnail=$2, subscribers=$3, description=$4,
        link=$5, category=$6, status=$7
       WHERE id=$8 RETURNING *`,
      [name, thumbnail || null, subscribers || '0', description || null, link, category, status || 'active', id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

const deleteYouTube = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM youtube_channels WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { next(err); }
};

module.exports = { getYouTube, createYouTube, updateYouTube, deleteYouTube };
