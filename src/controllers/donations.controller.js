const pool = require('../db');

const getDonations = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM donations ORDER BY created_at DESC LIMIT 50');
    res.json(rows);
  } catch (err) { next(err); }
};

const getTopDonors = async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT CASE WHEN is_anonymous THEN 'Anonymous' ELSE name END AS name,
             SUM(amount) AS total, COUNT(*) AS count
      FROM donations
      GROUP BY CASE WHEN is_anonymous THEN 'Anonymous' ELSE name END
      ORDER BY total DESC LIMIT 5
    `);
    res.json(rows);
  } catch (err) { next(err); }
};

const createDonation = async (req, res, next) => {
  try {
    const { name, is_anonymous, amount, message } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Nominal tidak valid' });
    const displayName = is_anonymous ? 'Anonymous' : (name || 'Anonymous');
    const { rows } = await pool.query(
      `INSERT INTO donations (name, is_anonymous, amount, message)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [displayName, is_anonymous || false, amount, message || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

module.exports = { getDonations, getTopDonors, createDonation };
