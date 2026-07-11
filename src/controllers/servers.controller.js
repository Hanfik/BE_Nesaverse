const sql = require('../db');

function like(val) {
  return '%' + val.toLowerCase() + '%';
}

const getServers = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let rows;

    if (category && category !== 'All' && search) {
      rows = await sql`
        SELECT s.id, s.name, s.description, s.members, s.online, s.verified,
               s.featured, s.banner, s.icon,
               ARRAY_AGG(sc.category ORDER BY sc.category) AS categories
        FROM servers s
        JOIN server_categories sc ON sc.server_id = s.id
        WHERE sc.category = ${category}
          AND LOWER(s.name) LIKE ${like(search)}
        GROUP BY s.id
        ORDER BY s.featured DESC, s.members DESC
      `;
    } else if (category && category !== 'All') {
      rows = await sql`
        SELECT s.id, s.name, s.description, s.members, s.online, s.verified,
               s.featured, s.banner, s.icon,
               ARRAY_AGG(sc.category ORDER BY sc.category) AS categories
        FROM servers s
        JOIN server_categories sc ON sc.server_id = s.id
        WHERE s.id IN (SELECT server_id FROM server_categories WHERE category = ${category})
        GROUP BY s.id
        ORDER BY s.featured DESC, s.members DESC
      `;
    } else if (search) {
      rows = await sql`
        SELECT s.id, s.name, s.description, s.members, s.online, s.verified,
               s.featured, s.banner, s.icon,
               ARRAY_AGG(sc.category ORDER BY sc.category) AS categories
        FROM servers s
        LEFT JOIN server_categories sc ON sc.server_id = s.id
        WHERE LOWER(s.name) LIKE ${like(search)}
        GROUP BY s.id
        ORDER BY s.featured DESC, s.members DESC
      `;
    } else {
      rows = await sql`
        SELECT s.id, s.name, s.description, s.members, s.online, s.verified,
               s.featured, s.banner, s.icon,
               ARRAY_AGG(sc.category ORDER BY sc.category) AS categories
        FROM servers s
        LEFT JOIN server_categories sc ON sc.server_id = s.id
        GROUP BY s.id
        ORDER BY s.featured DESC, s.members DESC
      `;
    }

    res.json(rows);
  } catch (err) {
    next(err);
  }
};

const createServer = async (req, res, next) => {
  try {
    const { name, description, icon, banner, members, online, link, verified, featured, status } = req.body;
    if (!name) return res.status(400).json({ error: 'Nama wajib diisi' });
    const rows = await sql`
      INSERT INTO servers (name,description,icon,banner,members,online,link,verified,featured,status)
      VALUES (${name},${description||null},${icon||null},${banner||null},${members||0},${online||0},${link||null},${verified||false},${featured||false},${status||'active'})
      RETURNING *`;
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

const updateServer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, icon, banner, members, online, link, verified, featured, status } = req.body;
    const rows = await sql`
      UPDATE servers SET name=${name}, description=${description||null}, icon=${icon||null},
        banner=${banner||null}, members=${members||0}, online=${online||0}, link=${link||null},
        verified=${verified||false}, featured=${featured||false}, status=${status||'active'},
        updated_at=NOW()
      WHERE id=${id} RETURNING *`;
    if (!rows.length) return res.status(404).json({ error: 'Tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

const deleteServer = async (req, res, next) => {
  try {
    const { id } = req.params;
    await sql`DELETE FROM servers WHERE id=${id}`;
    res.json({ message: 'Server deleted' });
  } catch (err) { next(err); }
};

module.exports = { getServers, createServer, updateServer, deleteServer };

