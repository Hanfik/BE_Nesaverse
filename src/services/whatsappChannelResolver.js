const CHANNEL_REGEX = /whatsapp\.com\/channel\/([a-zA-Z0-9]+)/;

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

function extractChannelId(url) {
  if (!url || typeof url !== 'string') return null;
  const m = url.trim().match(CHANNEL_REGEX);
  return m ? m[1] : null;
}

function extractMeta(html, name) {
  const re = new RegExp(`<meta[^>]*property=["']${name}["'][^>]*content=["']([^"']+)["']`, 'i');
  const m = html.match(re);
  if (m) return m[1];
  const re2 = new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${name}["']`, 'i');
  const m2 = html.match(re2);
  return m2 ? m2[1] : null;
}

async function fetchWhatsAppChannel(url) {
  const channelId = extractChannelId(url);
  if (!channelId) throw new Error('URL WhatsApp Channel tidak valid. Format: https://whatsapp.com/channel/xxxxx');

  const res = await fetch(`https://whatsapp.com/channel/${channelId}`, {
    headers: { 'User-Agent': UA, Accept: 'text/html' },
    redirect: 'follow',
  });

  if (!res.ok) throw new Error(`Gagal mengakses WhatsApp channel: HTTP ${res.status}`);

  const html = await res.text();

  const name = extractMeta(html, 'og:title')
    || extractMeta(html, 'title')
    || null;

  const avatar = extractMeta(html, 'og:image') || null;

  const description = extractMeta(html, 'og:description')
    || extractMeta(html, 'description')
    || null;

  if (!name && !avatar) {
    return { username: channelId, followers: '0', avatar: null, name: null, partial: true };
  }

  return {
    username: channelId,
    name: name ? name.replace(/ - WhatsApp Channel$/i, '').trim() : null,
    avatar,
    description,
    followers: '0',
    partial: true,
  };
}

module.exports = { fetchWhatsAppChannel, extractChannelId };
