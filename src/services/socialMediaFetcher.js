const IG_REGEX = /instagram\.com\/([a-zA-Z0-9._]+)\/?$/;
const TT_REGEX = /tiktok\.com\/@([a-zA-Z0-9._]+)\/?$/;
const YT_HANDLE_REGEX = /youtube\.com\/@([a-zA-Z0-9._-]+)\/?$/;
const YT_CHANNEL_REGEX = /youtube\.com\/channel\/(UC[a-zA-Z0-9_-]+)/;
const YT_SHORT_REGEX = /youtu\.be\/([a-zA-Z0-9_-]+)/;

const { fetchDiscordInvite, extractInviteCode: extractDiscordCode } = require('./discordInviteResolver');
const { fetchWhatsAppChannel, extractChannelId: extractWhatsAppId } = require('./whatsappChannelResolver');
const { fetchRobloxGame, extractPlaceId: extractRobloxId } = require('./robloxGameResolver');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';
const IG_APP_ID = '936619743392459';

function decodeUnicode(str) {
  if (!str) return null;
  try {
    return str.replace(/\\u([0-9a-fA-F]{4})/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
  } catch {
    return str;
  }
}

function extractUsername(platform, url) {
  if (!url || typeof url !== 'string') return null;
  const u = url.trim();

  if (platform === 'instagram') {
    const m = u.match(IG_REGEX);
    return m ? m[1] : null;
  }

  if (platform === 'tiktok') {
    const m = u.match(TT_REGEX);
    return m ? m[1] : null;
  }

  if (platform === 'youtube') {
    let m = u.match(YT_HANDLE_REGEX);
    if (m) return { type: 'handle', value: m[1] };
    m = u.match(YT_CHANNEL_REGEX);
    if (m) return { type: 'channelId', value: m[1] };
    m = u.match(YT_SHORT_REGEX);
    if (m) return { type: 'videoId', value: m[1] };
    return null;
  }

  return null;
}

/* ─── Parse localized number text (Indonesian + English) ── */
function parseLocalizedCount(text) {
  if (!text) return 0;
  const clean = text.toLowerCase().replace(/subscriber|follower|pengikut/gi, '').trim();
  const match = clean.match(/([\d.,]+)\s*([a-zA-Z\u00c0-\u024f]*)/);
  if (!match) return 0;
  let numStr = match[1];
  const commaCount = (numStr.match(/,/g) || []).length;
  const dotCount = (numStr.match(/\./g) || []).length;
  if (commaCount > 1) {
    numStr = numStr.replace(/,/g, '');
  } else if (dotCount > 1) {
    numStr = numStr.replace(/\./g, '');
  } else if (commaCount === 1 && dotCount === 0) {
    const afterComma = numStr.split(',')[1] || '';
    if (afterComma.length <= 2) {
      numStr = numStr.replace(',', '.');
    } else {
      numStr = numStr.replace(/,/g, '');
    }
  } else if (dotCount === 1 && commaCount === 0) {
    const afterDot = numStr.split('.')[1] || '';
    if (afterDot.length > 2) {
      numStr = numStr.replace(/\./g, '');
    }
  }
  let num = parseFloat(numStr);
  if (isNaN(num)) return 0;
  const suffix = match[2].toLowerCase();
  if (suffix === 'k' || suffix === 'rb') num *= 1000;
  else if (suffix === 'm' || suffix === 'jt' || suffix === 'juta') num *= 1000000;
  else if (suffix === 'b' || suffix === 'miliar') num *= 1000000000;
  return Math.round(num);
}

/* ─── Instagram Scraper ─────────────────────────────────────────────────── */
async function fetchInstagramFollowers(username) {
  try {
    const res = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
      headers: {
        'User-Agent': UA,
        'Accept': '*/*',
        'X-IG-App-ID': IG_APP_ID,
        'X-Requested-With': 'XMLHttpRequest',
      },
      redirect: 'follow',
    });
    if (res.ok) {
      const data = await res.json();
      const user = data?.data?.user;
      if (user) {
        return {
          username: user.username || username,
          followers: user.edge_followed_by?.count ?? 0,
          avatar: user.profile_pic_url_hd || user.profile_pic_url || null,
          name: user.full_name || null,
        };
      }
    }
  } catch {}

  try {
    const res = await fetch(`https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
      headers: {
        'User-Agent': 'Instagram 275.0.0.27.98 Android (30/11; 420dpi; 1080x2400; samsung; SM-G991B; o1s; exynos2100; en_US; 458229258)',
        'X-IG-App-ID': IG_APP_ID,
      },
      redirect: 'follow',
    });
    if (res.ok) {
      const data = await res.json();
      const user = data?.data?.user;
      if (user) {
        return {
          username: user.username || username,
          followers: user.edge_followed_by?.count ?? 0,
          avatar: user.profile_pic_url_hd || user.profile_pic_url || null,
          name: user.full_name || null,
        };
      }
    }
  } catch {}

  try {
    const res = await fetch(`https://www.instagram.com/${username}/`, {
      headers: { 'User-Agent': UA, 'Accept': 'text/html' },
      redirect: 'follow',
    });
    const html = await res.text();
    const metaMatch = html.match(/"edge_followed_by":\s*\{\s*"count":\s*(\d+)/);
    const followers = metaMatch ? parseInt(metaMatch[1], 10) : 0;
    const avatarMatch = html.match(/"profile_pic_url_hd":\s*"([^"]+)"/);
    const avatar = avatarMatch ? decodeUnicode(avatarMatch[1]) : null;
    const nameMatch = html.match(/"full_name":\s*"([^"]+)"/);
    const name = nameMatch ? nameMatch[1] : null;
    if (followers > 0) return { username, followers, avatar, name };
  } catch {}

  return { username, followers: 0, avatar: null, name: null, partial: true };
}

/* ─── TikTok Scraper ────────────────────────────────────────────────────── */
async function fetchTikTokFollowers(username) {
  let html = '';

  // Method 1: Web page
  try {
    const res = await fetch(`https://www.tiktok.com/@${username}`, {
      headers: {
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });
    html = await res.text();

    // Try __UNIVERSAL_DATA_FOR_REHYDRATION__
    let match = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/);
    if (match) {
      try {
        const data = JSON.parse(match[1]);
        const scope = data?.['__DEFAULT_SCOPE__'];
        const user = scope?.webapp?.['user-detail']?.userInfo?.user
                  || scope?.webapp?.user_detail?.userInfo?.user;
        if (user) {
          return {
            username: user.uniqueId || username,
            followers: user.followerCount ?? 0,
            avatar: decodeUnicode(user.avatarThumb || null),
            name: user.nickname || null,
          };
        }
      } catch {}
    }

    // Try SIGI_STATE
    match = html.match(/<script id="SIGI_STATE"[^>]*>([\s\S]*?)<\/script>/);
    if (match) {
      try {
        const data = JSON.parse(match[1]);
        const userModules = data?.UserModule?.users;
        if (userModules) {
          const key = Object.keys(userModules)[0];
          const user = userModules[key];
          const stats = data?.UserModule?.stats?.[key];
          return {
            username: user?.uniqueId || username,
            followers: stats?.followerCount ?? 0,
            avatar: decodeUnicode(user?.avatarThumb || null),
            name: user?.nickname || null,
          };
        }
      } catch {}
    }

    // Regex fallback from HTML
    const followerMatch = html.match(/"followerCount":(\d+)/);
    const avatarMatch = html.match(/"avatarThumb":"([^"]+)"/);
    const nameMatch = html.match(/"nickname":"([^"]+)"/);
    if (followerMatch) {
      return {
        username,
        followers: parseInt(followerMatch[1], 10),
        avatar: decodeUnicode(avatarMatch ? avatarMatch[1] : null),
        name: nameMatch ? nameMatch[1] : null,
      };
    }
  } catch {}

  // Method 2: oembed (gets name only)
  try {
    const res = await fetch(`https://www.tiktok.com/oembed?url=https://www.tiktok.com/@${username}`, {
      headers: { 'User-Agent': UA, 'Accept': 'application/json' },
      redirect: 'follow',
    });
    if (res.ok) {
      const data = await res.json();
      return {
        username: username,
        followers: 0,
        avatar: data?.author?.avatar_url || null,
        name: data?.author_name || data?.author?.nickname || null,
        partial: true,
      };
    }
  } catch {}

  return { username, followers: 0, avatar: null, name: null, partial: true };
}

/* ─── YouTube Scraper ───────────────────────────────────────────────────── */
async function fetchYouTubeSubscribers(handle) {
  try {
    const res = await fetch(`https://www.youtube.com/@${handle}`, {
      headers: { 'User-Agent': UA, 'Accept': 'text/html' },
      redirect: 'follow',
    });
    const html = await res.text();

    let channelName = null;
    let subscriberCount = 0;
    let avatar = null;

    const accessMatch = html.match(/"subscriberCountText":\{"accessibility":\{"accessibilityData":\{"label":"([^"]+)"/);
    if (accessMatch) {
      subscriberCount = parseLocalizedCount(accessMatch[1]);
    }

    if (!subscriberCount) {
      const simpleMatch = html.match(/"subscriberCountText":\{"simpleText":"([^"]+)"/);
      if (simpleMatch) {
        subscriberCount = parseLocalizedCount(simpleMatch[1]);
      }
    }

    if (!subscriberCount) {
      const numMatch = html.match(/"subscriberCount":(\d+)/);
      if (numMatch) {
        subscriberCount = parseInt(numMatch[1], 10);
      }
    }

    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    if (titleMatch) {
      channelName = titleMatch[1].replace(/\s*-\s*YouTube$/, '').trim();
    }

    const avatarMatch = html.match(/"avatar":\s*\{[^}]*"thumbnails":\s*\[\s*\{[^}]*"url":\s*"([^"]+)"/);
    if (avatarMatch) {
      avatar = avatarMatch[1];
    }

    const ytDataMatch = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/);
    if (ytDataMatch) {
      try {
        const data = JSON.parse(ytDataMatch[1]);
        const str = JSON.stringify(data);
        const subIdx = str.indexOf('subscriberCountText');
        if (subIdx >= 0) {
          const context = str.substring(subIdx, subIdx + 200);
          const labelMatch = context.match(/"label":"([^"]+)"/);
          if (labelMatch) {
            subscriberCount = parseLocalizedCount(labelMatch[1]);
          }
          const stMatch = context.match(/"simpleText":"([^"]+)"/);
          if (stMatch && !subscriberCount) {
            subscriberCount = parseLocalizedCount(stMatch[1]);
          }
        }
      } catch {}
    }

    return {
      username: handle,
      followers: subscriberCount,
      avatar,
      name: channelName,
    };
  } catch {
    return { username: handle, followers: 0, avatar: null, name: null };
  }
}

/* ─── Main export ───────────────────────────────────────────────────────── */
async function fetchFollowers(platform, url) {
  if (platform === 'instagram') {
    const username = extractUsername('instagram', url);
    if (!username) throw new Error('URL Instagram tidak valid. Format: https://www.instagram.com/username/');
    return { ...await fetchInstagramFollowers(username), platform: 'instagram' };
  }

  if (platform === 'tiktok') {
    const username = extractUsername('tiktok', url);
    if (!username) throw new Error('URL TikTok tidak valid. Format: https://www.tiktok.com/@username');
    return { ...await fetchTikTokFollowers(username), platform: 'tiktok' };
  }

  if (platform === 'youtube') {
    const info = extractUsername('youtube', url);
    if (!info) throw new Error('URL YouTube tidak valid. Format: https://www.youtube.com/@handle');
    if (info.type === 'videoId') throw new Error('URL video tidak bisa dipakai. Gunakan URL channel: https://www.youtube.com/@handle');
    return { ...await fetchYouTubeSubscribers(info.value), platform: 'youtube' };
  }

  if (platform === 'discord') {
    return { ...await fetchDiscordInvite(url), platform: 'discord' };
  }

  if (platform === 'whatsapp') {
    return { ...await fetchWhatsAppChannel(url), platform: 'whatsapp' };
  }

  if (platform === 'roblox') {
    return { ...await fetchRobloxGame(url), platform: 'roblox' };
  }

  throw new Error('Platform tidak didukung. Gunakan: instagram, tiktok, youtube, discord, whatsapp, roblox');
}

module.exports = { fetchFollowers, extractUsername };
