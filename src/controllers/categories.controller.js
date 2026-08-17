const pool = require('../db');

const VALID_PLATFORM_TYPES = ['discord', 'whatsapp', 'instagram', 'tiktok', 'youtube', 'roblox', 'fanart'];

/* ─── GET /api/categories?platform=discord ─── */
const getCategories = async (req, res, next) => {
  try {
    const { platform } = req.query;
    const conditions = [];
    const params = [];
    let idx = 1;

    if (platform) {
      conditions.push(`pt.name = $${idx++}`);
      params.push(platform);
    }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const { rows } = await pool.query(`
      SELECT c.*, pt.name AS platform_name
      FROM categories c
      JOIN platform_types pt ON c.platform_type_id = pt.id
      ${where}
      ORDER BY pt.name, c.name
    `, params);

    res.json(rows);
  } catch (err) { next(err); }
};

/* ─── GET /api/categories/all?platform=discord&search=... ─── */
const getAllCategories = async (req, res, next) => {
  try {
    const { platform, search } = req.query;
    const conditions = [];
    const params = [];
    let idx = 1;

    if (platform) {
      conditions.push(`pt.name = $${idx++}`);
      params.push(platform);
    }
    if (search) {
      conditions.push(`LOWER(c.name) LIKE $${idx++}`);
      params.push('%' + search.toLowerCase() + '%');
    }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const { rows } = await pool.query(`
      SELECT c.*, pt.name AS platform_name
      FROM categories c
      JOIN platform_types pt ON c.platform_type_id = pt.id
      ${where}
      ORDER BY pt.name, c.name
    `, params);

    res.json(rows);
  } catch (err) { next(err); }
};

/* ─── POST /api/categories ─── */
const createCategory = async (req, res, next) => {
  try {
    const { platform, name } = req.body;

    if (!platform || !VALID_PLATFORM_TYPES.includes(platform)) {
      return res.status(400).json({ error: `Platform harus salah satu dari: ${VALID_PLATFORM_TYPES.join(', ')}` });
    }
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Nama kategori wajib diisi' });
    }
    if (name.length > 100) {
      return res.status(400).json({ error: 'Nama kategori maksimal 100 karakter' });
    }

    const typeRes = await pool.query('SELECT id FROM platform_types WHERE name = $1', [platform]);
    if (!typeRes.rows.length) {
      return res.status(400).json({ error: 'Platform tidak valid' });
    }
    const platform_type_id = typeRes.rows[0].id;

    const { rows } = await pool.query(
      `INSERT INTO categories (platform_type_id, name)
       VALUES ($1, $2)
       ON CONFLICT (platform_type_id, name) DO NOTHING
       RETURNING *`,
      [platform_type_id, name.trim()]
    );

    if (rows.length === 0) {
      return res.status(409).json({ error: 'Kategori sudah ada untuk platform ini' });
    }

    res.status(201).json({ ...rows[0], platform_name: platform });
  } catch (err) { next(err); }
};

/* ─── PUT /api/categories/:id ─── */
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'ID tidak valid' });
    }
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Nama kategori wajib diisi' });
    }
    if (name.length > 100) {
      return res.status(400).json({ error: 'Nama kategori maksimal 100 karakter' });
    }

    const { rows } = await pool.query(
      `UPDATE categories SET name = $1 WHERE id = $2 RETURNING *`,
      [name.trim(), id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Kategori tidak ditemukan' });
    }

    res.json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Kategori sudah ada untuk platform ini' });
    }
    next(err);
  }
};

/* ─── DELETE /api/categories/:id ─── */
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'ID tidak valid' });
    }

    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Kategori tidak ditemukan' });
    }

    res.json({ success: true });
  } catch (err) { next(err); }
};

module.exports = { getCategories, getAllCategories, createCategory, updateCategory, deleteCategory };
