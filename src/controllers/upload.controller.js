const { createUploadUrl } = require('../services/r2.service');

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg', 'image/png', 'image/webp',
  'image/gif', 'image/avif',
];

const ALLOWED_VIDEO_TYPES = [
  'video/mp4', 'video/webm',
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;  // 10 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;  // 50 MB

function sanitizeFilename(name) {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 100);
}

const requestPresign = async (req, res, next) => {
  try {
    const { folder, filename, contentType, size } = req.body;

    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({ error: 'filename wajib diisi' });
    }
    if (!contentType || typeof contentType !== 'string') {
      return res.status(400).json({ error: 'contentType wajib diisi' });
    }
    if (!size || typeof size !== 'number' || size <= 0) {
      return res.status(400).json({ error: 'size harus angka positif' });
    }

    const isImage = ALLOWED_IMAGE_TYPES.includes(contentType);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(contentType);

    if (!isImage && !isVideo) {
      return res.status(400).json({
        error: `Tipe file tidak diizinkan. Allowed: ${[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(', ')}`,
      });
    }

    if (isImage && size > MAX_IMAGE_SIZE) {
      return res.status(413).json({ error: `Gambar maks 10MB (file: ${(size / 1024 / 1024).toFixed(1)}MB)` });
    }
    if (isVideo && size > MAX_VIDEO_SIZE) {
      return res.status(413).json({ error: `Video maks 50MB (file: ${(size / 1024 / 1024).toFixed(1)}MB)` });
    }

    const safeName = sanitizeFilename(filename);
    const safeFolder = (folder || 'uploads').replace(/[^a-zA-Z0-9/_-]/g, '');

    const result = await createUploadUrl({
      folder: safeFolder,
      filename: safeName,
      contentType,
      size,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

const requestDonationProofPresign = async (req, res, next) => {
  try {
    const { filename, contentType, size } = req.body;

    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({ error: 'filename wajib diisi' });
    }
    if (!contentType || typeof contentType !== 'string') {
      return res.status(400).json({ error: 'contentType wajib diisi' });
    }
    if (!size || typeof size !== 'number' || size <= 0) {
      return res.status(400).json({ error: 'size harus angka positif' });
    }

    const isImage = ALLOWED_IMAGE_TYPES.includes(contentType);
    if (!isImage) {
      return res.status(400).json({
        error: `Tipe file tidak diizinkan. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
      });
    }

    if (size > 5 * 1024 * 1024) {
      return res.status(413).json({ error: `Ukuran maks 5MB (file: ${(size / 1024 / 1024).toFixed(1)}MB)` });
    }

    const safeName = sanitizeFilename(filename);

    const result = await createUploadUrl({
      folder: 'donations/proof',
      filename: safeName,
      contentType,
      size,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { requestPresign, requestDonationProofPresign };
