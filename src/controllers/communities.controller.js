const pool = require('../db');

const getCommunities = async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        id,
        name,
        initial,
        color,
        members,
        growth,
        safety_score AS "safetyScore",
        status
      FROM communities
      ORDER BY id ASC
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { getCommunities };
