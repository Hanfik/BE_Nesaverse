const pool = require('../db');

const getRoblox = async (req, res, next) => {
  try {
    const { search } = req.query;
    let result;

    if (search) {
      result = await pool.query(
        "SELECT * FROM roblox_games WHERE status='active' AND LOWER(name) LIKE $1 ORDER BY id ASC",
        ['%' + search.toLowerCase() + '%']
      );
    } else {
      result = await pool.query(
        "SELECT * FROM roblox_games WHERE status='active' ORDER BY id ASC"
      );
    }

    res.json(result.rows);
  } catch (err) { next(err); }
};

const createRoblox = async (req, res, next) => {
  try {
    const { name, thumbnail, description, link_game, link_community } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO roblox_games (name, thumbnail, description, link_game, link_community)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, thumbnail || null, description || null, link_game, link_community || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

const updateRoblox = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, thumbnail, description, link_game, link_community, status } = req.body;
    const { rows } = await pool.query(
      `UPDATE roblox_games SET name=$1, thumbnail=$2, description=$3, link_game=$4,
        link_community=$5, status=$6
       WHERE id=$7 RETURNING *`,
      [name, thumbnail || null, description || null, link_game, link_community || null, status || 'active', id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

const deleteRoblox = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM roblox_games WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { next(err); }
};

module.exports = { getRoblox, createRoblox, updateRoblox, deleteRoblox };
