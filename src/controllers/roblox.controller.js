const sql = require('../db');

const getRoblox = async (req, res, next) => {
  try {
    const { search } = req.query;
    let rows;
    if (search) {
      rows = await sql`SELECT * FROM roblox_games WHERE status='active' AND LOWER(name) LIKE ${'%'+search.toLowerCase()+'%'} ORDER BY id ASC`;
    } else {
      rows = await sql`SELECT * FROM roblox_games WHERE status='active' ORDER BY id ASC`;
    }
    res.json(rows);
  } catch (err) { next(err); }
};

const createRoblox = async (req, res, next) => {
  try {
    const { name, thumbnail, description, link_game, link_community } = req.body;
    const rows = await sql`INSERT INTO roblox_games (name,thumbnail,description,link_game,link_community) VALUES (${name},${thumbnail||null},${description||null},${link_game},${link_community||null}) RETURNING *`;
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

const updateRoblox = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, thumbnail, description, link_game, link_community, status } = req.body;
    const rows = await sql`UPDATE roblox_games SET name=${name},thumbnail=${thumbnail||null},description=${description||null},link_game=${link_game},link_community=${link_community||null},status=${status||'active'} WHERE id=${id} RETURNING *`;
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

const deleteRoblox = async (req, res, next) => {
  try {
    await sql`DELETE FROM roblox_games WHERE id=${req.params.id}`;
    res.json({ success: true });
  } catch (err) { next(err); }
};

module.exports = { getRoblox, createRoblox, updateRoblox, deleteRoblox };
