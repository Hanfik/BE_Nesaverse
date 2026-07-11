const sql = require('../db');

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
    let rows;
    if (f.mode === 'both') {
      rows = await sql`SELECT * FROM instagram_accounts WHERE status='active' AND category=${f.category} AND LOWER(name) LIKE ${'%'+f.search.toLowerCase()+'%'} ORDER BY id ASC`;
    } else if (f.mode === 'category') {
      rows = await sql`SELECT * FROM instagram_accounts WHERE status='active' AND category=${f.category} ORDER BY id ASC`;
    } else if (f.mode === 'search') {
      rows = await sql`SELECT * FROM instagram_accounts WHERE status='active' AND (LOWER(name) LIKE ${'%'+f.search.toLowerCase()+'%'} OR LOWER(handle) LIKE ${'%'+f.search.toLowerCase()+'%'}) ORDER BY id ASC`;
    } else {
      rows = await sql`SELECT * FROM instagram_accounts WHERE status='active' ORDER BY id ASC`;
    }
    res.json(rows);
  } catch (err) { next(err); }
};

const createInstagram = async (req, res, next) => {
  try {
    const { name, handle, avatar, followers, posts, category, bio, verified, link, gradient } = req.body;
    const rows = await sql`INSERT INTO instagram_accounts (name,handle,avatar,followers,posts,category,bio,verified,link,gradient) VALUES (${name},${handle},${avatar||null},${followers||'0'},${posts||0},${category},${bio||null},${verified||false},${link||null},${gradient||null}) RETURNING *`;
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

const updateInstagram = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, handle, avatar, followers, posts, category, bio, verified, link, gradient, status } = req.body;
    const rows = await sql`UPDATE instagram_accounts SET name=${name},handle=${handle},avatar=${avatar||null},followers=${followers||'0'},posts=${posts||0},category=${category},bio=${bio||null},verified=${verified||false},link=${link||null},gradient=${gradient||null},status=${status||'active'} WHERE id=${id} RETURNING *`;
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

const deleteInstagram = async (req, res, next) => {
  try {
    const { id } = req.params;
    await sql`DELETE FROM instagram_accounts WHERE id=${id}`;
    res.json({ success: true });
  } catch (err) { next(err); }
};

module.exports = { getInstagram, createInstagram, updateInstagram, deleteInstagram };
