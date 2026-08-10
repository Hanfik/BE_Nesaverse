const pool = require('../db');

function like(val) {
  return '%' + val.toLowerCase() + '%';
}

const VALID_PLATFORM_TYPES = ['discord', 'whatsapp', 'instagram', 'tiktok', 'youtube', 'roblox', 'fanart'];
const VALID_STATUSES = ['active', 'inactive'];

function validatePlatformInput(data, isUpdate = false) {
  const errors = [];
  if (!isUpdate) {
    if (!data.type_name || !VALID_PLATFORM_TYPES.includes(data.type_name)) {
      errors.push(`type_name must be one of: ${VALID_PLATFORM_TYPES.join(', ')}`);
    }
  }
  if (data.status && !VALID_STATUSES.includes(data.status)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}`);
  }
  if (data.name && typeof data.name === 'string' && data.name.length > 200) {
    errors.push('name must be 200 characters or less');
  }
  return errors;
}

/* ─── GET /api/platforms?type=discord&status=active&search=...&sort=desc ─── */
const getPlatforms = async (req, res, next) => {
  try {
    const { type, status, search, category, sort } = req.query;
    const conditions = [];
    const params = [];
    let idx = 1;

    if (type) { conditions.push(`pt.name = $${idx++}`); params.push(type); }
    if (status) { conditions.push(`p.status = $${idx++}`); params.push(status); }
    if (category && category !== 'Semua') { conditions.push(`p.category ILIKE $${idx++}`); params.push('%' + category + '%'); }
    if (search) { conditions.push(`(LOWER(p.name) LIKE $${idx} OR LOWER(p.handle) LIKE $${idx} OR LOWER(p.description) LIKE $${idx})`); params.push(like(search)); idx++; }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const sortDir = sort === 'asc' ? 'ASC' : 'DESC';
    const result = await pool.query(`
      SELECT p.*, pt.name AS type_name, pt.icon AS type_icon, pt.color AS type_color
      FROM platforms p
      JOIN platform_types pt ON p.type_id = pt.id
      ${where}
      ORDER BY p.is_featured DESC, p.followers ${sortDir}, p.id ${sortDir}
    `, params);

    res.json(result.rows);
  } catch (err) { next(err); }
};

/* ─── GET /api/platforms/all (admin — no status filter) ─── */
const getAllPlatforms = async (req, res, next) => {
  try {
    const { type, search, sort } = req.query;
    const conditions = [];
    const params = [];
    let idx = 1;

    if (type) { conditions.push(`pt.name = $${idx++}`); params.push(type); }
    if (search) { conditions.push(`(LOWER(p.name) LIKE $${idx} OR LOWER(p.handle) LIKE $${idx} OR LOWER(p.description) LIKE $${idx})`); params.push(like(search)); idx++; }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const sortDir = sort === 'desc' ? 'DESC' : 'ASC';
    const result = await pool.query(`
      SELECT p.*, pt.name AS type_name, pt.icon AS type_icon, pt.color AS type_color
      FROM platforms p
      JOIN platform_types pt ON p.type_id = pt.id
      ${where}
      ORDER BY p.is_featured DESC, p.id ${sortDir}
    `, params);

    res.json(result.rows);
  } catch (err) { next(err); }
};

/* ─── GET /api/platforms/types ─── */
const getTypes = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM platform_types ORDER BY id');
    res.json(result.rows);
  } catch (err) { next(err); }
};

/* ─── POST /api/platforms ─── */
const createPlatform = async (req, res, next) => {
  try {
    const { type_name, name, handle, description, avatar, banner, followers, posts, extra, url, is_featured, is_verified, status, category } = req.body;

    const errors = validatePlatformInput(req.body, false);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(', ') });
    }

    const typeRes = await pool.query('SELECT id FROM platform_types WHERE name = $1', [type_name]);
    if (!typeRes.rows.length) return res.status(400).json({ error: 'Invalid platform type' });
    const type_id = typeRes.rows[0].id;

    const { rows } = await pool.query(
      `INSERT INTO platforms (type_id, name, handle, description, avatar, banner, followers, posts, extra, url, is_featured, is_verified, status, category)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
       [type_id, name, handle || null, description || null, avatar || null, banner || null,
        String(followers || '0'), String(posts || '0'), extra || '{}', url || null,
       is_featured || false, is_verified || false, status || 'active', category || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

/* ─── PUT /api/platforms/:id ─── */
const updatePlatform = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type_name, name, handle, description, avatar, banner, followers, posts, extra, url, is_featured, is_verified, status, category } = req.body;

    const errors = validatePlatformInput(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(', ') });
    }

    let type_id;
    if (type_name) {
      const typeRes = await pool.query('SELECT id FROM platform_types WHERE name = $1', [type_name]);
      if (!typeRes.rows.length) return res.status(400).json({ error: 'Invalid platform type' });
      type_id = typeRes.rows[0].id;
    }

    const { rows } = await pool.query(
      `UPDATE platforms SET
        type_id = COALESCE($1, type_id), name = COALESCE($2, name), handle = $3, description = $4,
        avatar = $5, banner = $6, followers = COALESCE($7, followers), posts = COALESCE($8, posts),
        extra = COALESCE($9, extra), url = $10, is_featured = COALESCE($11, is_featured),
        is_verified = COALESCE($12, is_verified), status = COALESCE($13, status), category = $14,
        updated_at = NOW()
       WHERE id = $15 RETURNING *`,
      [type_id || null, name, handle, description, avatar, banner, followers, posts,
       extra ? JSON.stringify(extra) : null, url, is_featured, is_verified, status, category, id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

/* ─── DELETE /api/platforms/:id ─── */
const deletePlatform = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const result = await pool.query('DELETE FROM platforms WHERE id=$1 RETURNING id', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) { next(err); }
};

module.exports = { getPlatforms, getAllPlatforms, getTypes, createPlatform, updatePlatform, deletePlatform };
