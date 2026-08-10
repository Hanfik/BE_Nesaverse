const { fetchFollowers } = require('../services/socialMediaFetcher');

const VALID_PLATFORMS = ['instagram', 'tiktok', 'youtube'];

const fetchSocialData = async (req, res, next) => {
  try {
    const { platform, url } = req.body;
    if (!platform || !VALID_PLATFORMS.includes(platform)) {
      return res.status(400).json({ error: `Platform harus salah satu dari: ${VALID_PLATFORMS.join(', ')}` });
    }
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL wajib diisi' });
    }

    const data = await fetchFollowers(platform, url.trim());
    res.json(data);
  } catch (err) {
    res.status(422).json({ error: err.message || 'Gagal mengambil data dari platform' });
  }
};

module.exports = { fetchSocialData };
