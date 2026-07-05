const sql = require('../db');

const getServers = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    // Join servers with their categories, aggregate categories as array
    let rows;

    if (category && category !== 'All' && search) {
      rows = await sql`
        SELECT
          s.id,
          s.name,
          s.description,
          s.members,
          s.online,
          s.verified,
          s.featured,
          s.banner,
          s.icon,
          ARRAY_AGG(sc.category ORDER BY sc.category) AS categories
        FROM servers s
        JOIN server_categories sc ON sc.server_id = s.id
        WHERE sc.category = ${category}
          AND LOWER(s.name) LIKE ${'%' + search.toLowerCase() + '%'}
        GROUP BY s.id
        ORDER BY s.featured DESC, s.members DESC
      `;
    } else if (category && category !== 'All') {
      rows = await sql`
        SELECT
          s.id,
          s.name,
          s.description,
          s.members,
          s.online,
          s.verified,
          s.featured,
          s.banner,
          s.icon,
          ARRAY_AGG(sc.category ORDER BY sc.category) AS categories
        FROM servers s
        JOIN server_categories sc ON sc.server_id = s.id
        WHERE s.id IN (
          SELECT server_id FROM server_categories WHERE category = ${category}
        )
        GROUP BY s.id
        ORDER BY s.featured DESC, s.members DESC
      `;
    } else if (search) {
      rows = await sql`
        SELECT
          s.id,
          s.name,
          s.description,
          s.members,
          s.online,
          s.verified,
          s.featured,
          s.banner,
          s.icon,
          ARRAY_AGG(sc.category ORDER BY sc.category) AS categories
        FROM servers s
        LEFT JOIN server_categories sc ON sc.server_id = s.id
        WHERE LOWER(s.name) LIKE ${'%' + search.toLowerCase() + '%'}
        GROUP BY s.id
        ORDER BY s.featured DESC, s.members DESC
      `;
    } else {
      rows = await sql`
        SELECT
          s.id,
          s.name,
          s.description,
          s.members,
          s.online,
          s.verified,
          s.featured,
          s.banner,
          s.icon,
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

module.exports = { getServers };
