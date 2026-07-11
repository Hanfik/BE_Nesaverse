const pool = require('../db');

const getChannels = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let result;

    if (category && category !== 'All' && search) {
      result = await pool.query(
        `SELECT id, name, category, followers, description, avatar
         FROM channels
         WHERE category = $1
           AND LOWER(name) LIKE $2
         ORDER BY followers DESC`,
        [category, '%' + search.toLowerCase() + '%']
      );
    } else if (category && category !== 'All') {
      result = await pool.query(
        `SELECT id, name, category, followers, description, avatar
         FROM channels
         WHERE category = $1
         ORDER BY followers DESC`,
        [category]
      );
    } else if (search) {
      result = await pool.query(
        `SELECT id, name, category, followers, description, avatar
         FROM channels
         WHERE LOWER(name) LIKE $1
         ORDER BY followers DESC`,
        ['%' + search.toLowerCase() + '%']
      );
    } else {
      result = await pool.query(
        `SELECT id, name, category, followers, description, avatar
         FROM channels
         ORDER BY followers DESC`
      );
    }

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

const createChannel = async (req, res, next) => {
  try {
    const { name, description, avatar, category, followers, link, status } = req.body;
    if (!name) return res.status(400).json({ error: 'Nama wajib diisi' });
    const { rows } = await pool.query(
      `INSERT INTO channels (name, description, avatar, category, followers, link, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, description || null, avatar || null, category || 'Other', followers || 0, link || null, status || 'active']
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

const updateChannel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, avatar, category, followers, link, status } = req.body;
    const { rows } = await pool.query(
      `UPDATE channels SET name=$1, description=$2, avatar=$3, category=$4, followers=$5,
        link=$6, status=$7, updated_at=NOW()
       WHERE id=$8 RETURNING *`,
      [name, description || null, avatar || null, category || 'Other', followers || 0, link || null, status || 'active', id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

const deleteChannel = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM channels WHERE id=$1', [id]);
    res.json({ message: 'Channel deleted' });
  } catch (err) { next(err); }
};

module.exports = { getChannels, createChannel, updateChannel, deleteChannel };
