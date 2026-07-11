const pool = require('../db');

function like(val) {
  return '%' + val.toLowerCase() + '%';
}

const getServers = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let result;

    if (category && category !== 'All' && search) {
      result = await pool.query(`
        SELECT s.id, s.name, s.description, s.members, s.online, s.verified,
               s.featured, s.banner, s.icon,
               ARRAY_AGG(sc.category ORDER BY sc.category) AS categories
        FROM servers s
        JOIN server_categories sc ON sc.server_id = s.id
        WHERE sc.category = $1
          AND LOWER(s.name) LIKE $2
        GROUP BY s.id
        ORDER BY s.featured DESC, s.members DESC
      `, [category, like(search)]);
    } else if (category && category !== 'All') {
      result = await pool.query(`
        SELECT s.id, s.name, s.description, s.members, s.online, s.verified,
               s.featured, s.banner, s.icon,
               ARRAY_AGG(sc.category ORDER BY sc.category) AS categories
        FROM servers s
        JOIN server_categories sc ON sc.server_id = s.id
        WHERE s.id IN (SELECT server_id FROM server_categories WHERE category = $1)
        GROUP BY s.id
        ORDER BY s.featured DESC, s.members DESC
      `, [category]);
    } else if (search) {
      result = await pool.query(`
        SELECT s.id, s.name, s.description, s.members, s.online, s.verified,
               s.featured, s.banner, s.icon,
               ARRAY_AGG(sc.category ORDER BY sc.category) AS categories
        FROM servers s
        LEFT JOIN server_categories sc ON sc.server_id = s.id
        WHERE LOWER(s.name) LIKE $1
        GROUP BY s.id
        ORDER BY s.featured DESC, s.members DESC
      `, [like(search)]);
    } else {
      result = await pool.query(`
        SELECT s.id, s.name, s.description, s.members, s.online, s.verified,
               s.featured, s.banner, s.icon,
               ARRAY_AGG(sc.category ORDER BY sc.category) AS categories
        FROM servers s
        LEFT JOIN server_categories sc ON sc.server_id = s.id
        GROUP BY s.id
        ORDER BY s.featured DESC, s.members DESC
      `);
    }

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

const createServer = async (req, res, next) => {
  try {
    const { name, description, icon, banner, members, online, link, verified, featured, status } = req.body;
    if (!name) return res.status(400).json({ error: 'Nama wajib diisi' });
    const { rows } = await pool.query(
      `INSERT INTO servers (name, description, icon, banner, members, online, link, verified, featured, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [name, description || null, icon || null, banner || null, members || 0, online || 0, link || null, verified || false, featured || false, status || 'active']
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

const updateServer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, icon, banner, members, online, link, verified, featured, status } = req.body;
    const { rows } = await pool.query(
      `UPDATE servers SET name=$1, description=$2, icon=$3, banner=$4, members=$5, online=$6,
        link=$7, verified=$8, featured=$9, status=$10, updated_at=NOW()
       WHERE id=$11 RETURNING *`,
      [name, description || null, icon || null, banner || null, members || 0, online || 0, link || null, verified || false, featured || false, status || 'active', id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

const deleteServer = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM servers WHERE id=$1', [id]);
    res.json({ message: 'Server deleted' });
  } catch (err) { next(err); }
};

module.exports = { getServers, createServer, updateServer, deleteServer };
