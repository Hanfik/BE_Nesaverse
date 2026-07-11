const sql = require('../db');

const getChannels = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    let rows;

    // Build query dynamically based on filters
    if (category && category !== 'All' && search) {
      rows = await sql`
        SELECT id, name, category, followers, description, avatar
        FROM channels
        WHERE category = ${category}
          AND LOWER(name) LIKE ${'%' + search.toLowerCase() + '%'}
        ORDER BY followers DESC
      `;
    } else if (category && category !== 'All') {
      rows = await sql`
        SELECT id, name, category, followers, description, avatar
        FROM channels
        WHERE category = ${category}
        ORDER BY followers DESC
      `;
    } else if (search) {
      rows = await sql`
        SELECT id, name, category, followers, description, avatar
        FROM channels
        WHERE LOWER(name) LIKE ${'%' + search.toLowerCase() + '%'}
        ORDER BY followers DESC
      `;
    } else {
      rows = await sql`
        SELECT id, name, category, followers, description, avatar
        FROM channels
        ORDER BY followers DESC
      `;
    }

    res.json(rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { getChannels };

const createChannel = async (req, res, next) => {
  try {
    const { name, description, avatar, category, followers, link, status } = req.body;
    if (!name) return res.status(400).json({ error: 'Nama wajib diisi' });
    const rows = await sql`
      INSERT INTO channels (name,description,avatar,category,followers,link,status)
      VALUES (${name},${description||null},${avatar||null},${category||'Other'},${followers||0},${link||null},${status||'active'})
      RETURNING *`;
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

const updateChannel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, avatar, category, followers, link, status } = req.body;
    const rows = await sql`
      UPDATE channels SET name=${name}, description=${description||null}, avatar=${avatar||null},
        category=${category||'Other'}, followers=${followers||0}, link=${link||null},
        status=${status||'active'}, updated_at=NOW()
      WHERE id=${id} RETURNING *`;
    if (!rows.length) return res.status(404).json({ error: 'Tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

const deleteChannel = async (req, res, next) => {
  try {
    const { id } = req.params;
    await sql`DELETE FROM channels WHERE id=${id}`;
    res.json({ message: 'Channel deleted' });
  } catch (err) { next(err); }
};

module.exports = { getChannels, createChannel, updateChannel, deleteChannel };
