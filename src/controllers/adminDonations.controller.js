const pool = require('../db');

/* ─── GET /api/admin/donations?page=1&limit=10&search=...&status=pending ─── */
const getDonations = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const search = req.query.search || '';
    const status = req.query.status || '';
    const offset = (page - 1) * limit;

    const conditions = [];
    const searchParams = [];
    const statusParams = [];
    let idx = 1;

    if (search) {
      conditions.push(`(LOWER(name) LIKE $${idx++} OR LOWER(message) LIKE $${idx++})`);
      searchParams.push('%' + search.toLowerCase() + '%', '%' + search.toLowerCase() + '%');
    }

    if (status && status !== 'all') {
      conditions.push(`status = $${idx++}`);
      statusParams.push(status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) FROM donations ${whereClause}`;
    const dataQuery = `
      SELECT * FROM donations
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${idx++} OFFSET $${idx++}
    `;

    const allParams = [...searchParams, ...statusParams, limit, offset];

    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, [...searchParams, ...statusParams]),
      pool.query(dataQuery, allParams),
    ]);

    const total = parseInt(countResult.rows[0].count);

    res.json({
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) { next(err); }
};

/* ─── GET /api/admin/donations/stats ─── */
const getDonationStats = async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        COUNT(*)::int AS total_count,
        COALESCE(SUM(amount), 0)::bigint AS total_amount,
        COALESCE(AVG(amount), 0)::numeric(12,0) AS avg_amount
      FROM donations
      WHERE status = 'completed'
    `);
    res.json(rows[0]);
  } catch (err) { next(err); }
};

/* ─── GET /api/admin/donations/export ─── */
const exportDonations = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM donations ORDER BY created_at DESC');

    const BOM = '\uFEFF';
    const header = 'ID,Nama,Anonymous,Nominal,Status,Pesan,Tanggal\n';

    const sanitizeCsvField = (val) => {
      if (typeof val !== 'string') return val;
      if (/^[=+\-@\t\r]/.test(val)) return `'${val}`;
      return val;
    };

    const csv = rows.map(r => {
      const name = sanitizeCsvField((r.name || '').replace(/"/g, '""'));
      const msg = sanitizeCsvField((r.message || '').replace(/"/g, '""'));
      const date = new Date(r.created_at).toLocaleDateString('id-ID');
      return `${r.id},"${name}",${r.is_anonymous ? 'Ya' : 'Tidak'},${r.amount},${r.status || 'completed'},"${msg}",${date}`;
    }).join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="donations-${new Date().toISOString().slice(0,10)}.csv"`);
    res.send(BOM + header + csv);
  } catch (err) { next(err); }
};

/* ─── PATCH /api/admin/donations/:id/status ─── */
const updateDonationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'ID tidak valid' });
    }

    const validStatuses = ['pending', 'verified', 'completed', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status harus salah satu dari: ${validStatuses.join(', ')}` });
    }

    const { rows } = await pool.query(
      'UPDATE donations SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Donasi tidak ditemukan' });
    }

    res.json(rows[0]);
  } catch (err) { next(err); }
};

/* ─── DELETE /api/admin/donations/:id ─── */
const deleteDonation = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'ID tidak valid' });
    }

    const result = await pool.query('DELETE FROM donations WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Donasi tidak ditemukan' });
    }

    res.json({ success: true });
  } catch (err) { next(err); }
};

module.exports = { getDonations, getDonationStats, exportDonations, updateDonationStatus, deleteDonation };
