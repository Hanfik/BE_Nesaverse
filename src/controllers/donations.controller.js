const pool = require('../db');

const MAX_RECENT_DONATIONS = 50;
const TOP_DONORS_LIMIT = 5;

const getDonations = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM donations WHERE status = 'completed' ORDER BY created_at DESC LIMIT $1`,
      [MAX_RECENT_DONATIONS]
    );
    res.json(rows);
  } catch (err) { next(err); }
};

const getTopDonors = async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT name, SUM(amount) AS total, COUNT(*) AS count
      FROM donations
      WHERE status = 'completed'
      GROUP BY name
      ORDER BY total DESC LIMIT $1
    `, [TOP_DONORS_LIMIT]);
    res.json(rows);
  } catch (err) { next(err); }
};

const createDonation = async (req, res, next) => {
  try {
    const { name, is_anonymous, amount, message } = req.body;
    const MIN_DONATION = 1000;
    if (!amount || isNaN(Number(amount)) || Number(amount) < MIN_DONATION) {
      return res.status(400).json({ error: `Nominal minimal ${MIN_DONATION}` });
    }
    if (!is_anonymous && (!name || !name.trim())) {
      return res.status(400).json({ error: 'Nama wajib diisi, atau centang Anonymous' });
    }
    const displayName = is_anonymous ? 'Anonymous' : (name || 'Anonymous');
    const { rows } = await pool.query(
      `INSERT INTO donations (name, is_anonymous, amount, message, status)
       VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
      [displayName, is_anonymous || false, Number(amount), message || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

const uploadProof = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { proof_url } = req.body;

    if (!proof_url) return res.status(400).json({ error: 'Bukti pembayaran wajib diisi' });

    const existing = await pool.query('SELECT status FROM donations WHERE id = $1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Donasi tidak ditemukan' });
    if (existing.rows[0].status === 'completed') {
      return res.status(400).json({ error: 'Donasi sudah selesai, tidak dapat mengubah bukti pembayaran' });
    }

    const { rows } = await pool.query(
      `UPDATE donations SET proof_url = $1 WHERE id = $2 RETURNING *`,
      [proof_url, id]
    );

    res.json(rows[0]);
  } catch (err) { next(err); }
};

module.exports = { getDonations, getTopDonors, createDonation, uploadProof };
