const ALLOWED_DOMAINS = [
  'fbcdn.net',
  'instagram.com',
  'tiktokcdn.com',
  'tiktok.com',
  'yt3.googleusercontent.com',
  'youtube.com',
  'googleusercontent.com',
  'ui-avatars.com',
];

const MAX_CONTENT_LENGTH = 10 * 1024 * 1024; // 10MB

function isAllowedDomain(hostname) {
  return ALLOWED_DOMAINS.some(d => hostname === d || hostname.endsWith('.' + d));
}

function isPrivateIP(hostname) {
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') return true;
  if (/^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|0\.)/.test(hostname)) return true;
  if (hostname === '169.254.169.254') return true;
  return false;
}

const imageProxy = async (req, res, next) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'Parameter url wajib diisi' });
    }

    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      return res.status(400).json({ error: 'URL tidak valid' });
    }

    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return res.status(400).json({ error: 'Hanya HTTP/HTTPS yang diizinkan' });
    }

    if (isPrivateIP(parsed.hostname)) {
      return res.status(403).json({ error: 'Akses ke IP private tidak diizinkan' });
    }

    if (!isAllowedDomain(parsed.hostname)) {
      return res.status(403).json({ error: `Domain ${parsed.hostname} tidak diizinkan` });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/*',
      },
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(response.status).json({ error: `Gagal fetch gambar: HTTP ${response.status}` });
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      return res.status(400).json({ error: 'Response bukan gambar' });
    }

    const contentLength = parseInt(response.headers.get('content-length') || '0', 10);
    if (contentLength > MAX_CONTENT_LENGTH) {
      return res.status(413).json({ error: 'Gambar terlalu besar (maks 10MB)' });
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length > MAX_CONTENT_LENGTH) {
      return res.status(413).json({ error: 'Gambar terlalu besar (maks 10MB)' });
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(buffer);
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'Timeout fetching gambar' });
    }
    next(err);
  }
};

module.exports = { imageProxy };
