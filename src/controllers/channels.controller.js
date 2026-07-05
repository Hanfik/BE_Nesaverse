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
