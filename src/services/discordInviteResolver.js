require('dotenv').config();

const DISCORD_API_BASE = 'https://discord.com/api/v10';
const CDN_BASE = 'https://cdn.discordapp.com';

const INVITE_REGEXES = [
  /discord\.gg\/([a-zA-Z0-9]+)/,
  /discord\.com\/invite\/([a-zA-Z0-9]+)/,
  /discordapp\.com\/invite\/([a-zA-Z0-9]+)/,
];

function extractInviteCode(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  for (const re of INVITE_REGEXES) {
    const m = trimmed.match(re);
    if (m) return m[1];
  }
  return null;
}

function constructIconUrl(guild) {
  if (!guild.icon) return null;
  const ext = guild.icon.startsWith('a_') ? 'gif' : 'png';
  return `${CDN_BASE}/icons/${guild.id}/${guild.icon}.${ext}?size=256`;
}

function constructBannerUrl(guild) {
  if (!guild.banner) return null;
  const ext = guild.banner.startsWith('a_') ? 'gif' : 'png';
  return `${CDN_BASE}/banners/${guild.id}/${guild.banner}.${ext}?size=600`;
}

async function fetchDiscordInvite(url) {
  const code = extractInviteCode(url);
  if (!code) throw new Error('URL Discord tidak valid. Format: https://discord.gg/xxxxx');

  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) throw new Error('DISCORD_BOT_TOKEN belum dikonfigurasi di server');

  const res = await fetch(`${DISCORD_API_BASE}/invites/${code}?with_counts=true&with_vanity_url=true`, {
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    if (res.status === 404) throw new Error('Invite link tidak ditemukan atau sudah expired');
    if (res.status === 401) throw new Error('Discord Bot Token tidak valid');
    throw new Error(`Discord API error: ${res.status}`);
  }

  const data = await res.json();
  const guild = data.guild;
  if (!guild) throw new Error('Data guild tidak ditemukan dari invite link');

  return {
    username: code,
    name: guild.name || null,
    avatar: constructIconUrl(guild),
    banner: constructBannerUrl(guild),
    followers: String(data.approximate_member_count || 0),
    online: data.approximate_presence_count || 0,
  };
}

module.exports = { fetchDiscordInvite, extractInviteCode };
