const sql = require('../db');

const getYouTube = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let rows;
    if (category && category !== 'All' && search) {
      rows = await sql`SELECT * FROM youtube_channels WHERE status='active' AND category=${category} AND LOWER(name) LIKE ${'%'+search.toLowerCase()+'%'} ORDER BY id ASC`;
    } else if (category && category !== 'All') {
      rows = await sql`SELECT * FROM youtube_channels WHERE status='active' AND category=${category} ORDER BY id ASC`;
    } else if (search) {
      rows = await sql`SELECT * FROM youtube_channels WHERE status='active' AND LOWER(name) LIKE ${'%'+search.toLowerCase()+'%'} ORDER BY id ASC`;
    } else {
      rows = await sql`SELECT * FROM youtube_channels WHERE status='active' ORDER BY id ASC`;
    }
    res.json(rows);
  } catch (err) { next(err); }
};

const createYouTube = async (req, res, next) => {
  try {
    const { name, thumbnail, subscribers, description, link, category } = req.body;
    const rows = await sql`INSERT INTO youtube_channels (name,thumbnail,subscribers,description,link,category) VALUES (${name},${thumbnail||null},${subscribers||'0'},${description||null},${link},${category}) RETURNING *`;
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

const updateYouTube = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, thumbnail, subscribers, description, link, category, status } = req.body;
    const rows = await sql`UPDATE youtube_channels SET name=${name},thumbnail=${thumbnail||null},subscribers=${subscribers||'0'},description=${description||null},link=${link},category=${category},status=${status||'active'} WHERE id=${id} RETURNING *`;
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

const deleteYouTube = async (req, res, next) => {
  try {
    await sql`DELETE FROM youtube_channels WHERE id=${req.params.id}`;
    res.json({ success: true });
  } catch (err) { next(err); }
};

module.exports = { getYouTube, createYouTube, updateYouTube, deleteYouTube };
