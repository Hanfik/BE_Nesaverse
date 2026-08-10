const GAME_URL_REGEXES = [
  /roblox\.com\/games\/(\d+)/,
  /roblox\.com\/experience\/(\d+)/,
];

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

function extractPlaceId(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  for (const re of GAME_URL_REGEXES) {
    const m = trimmed.match(re);
    if (m) return m[1];
  }
  return null;
}

function extractMeta(html, name) {
  const re = new RegExp(`<meta[^>]*property=["']${name}["'][^>]*content=["']([^"']+)["']`, 'i');
  const m = html.match(re);
  if (m) return m[1];
  const re2 = new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${name}["']`, 'i');
  const m2 = html.match(re2);
  return m2 ? m2[1] : null;
}

function extractOgImage(html) {
  const raw = extractMeta(html, 'og:image');
  if (!raw) return null;
  const decoded = raw.replace(/&amp;/g, '&');
  return decoded;
}

async function fetchRobloxGame(url) {
  const placeId = extractPlaceId(url);
  if (!placeId) throw new Error('URL Roblox tidak valid. Format: https://www.roblox.com/games/{id}/... atau https://www.roblox.com/experience/{id}/...');

  const gameUrl = `https://www.roblox.com/games/${placeId}`;

  const res = await fetch(gameUrl, {
    headers: { 'User-Agent': UA, Accept: 'text/html' },
    redirect: 'follow',
  });

  if (!res.ok) throw new Error(`Gagal mengakses halaman game Roblox: HTTP ${res.status}`);

  const html = await res.text();

  let name = extractMeta(html, 'og:title');
  if (name) name = name.replace(/\s*\|\s*Roblox.*$/i, '').trim();

  const thumbnail = extractOgImage(html);
  const description = extractMeta(html, 'og:description') || extractMeta(html, 'description') || null;

  if (!name && !thumbnail) {
    return { username: placeId, followers: '0', avatar: null, name: null, partial: true };
  }

  return {
    username: placeId,
    name: name || null,
    avatar: thumbnail,
    description,
    followers: '0',
  };
}

module.exports = { fetchRobloxGame, extractPlaceId };
