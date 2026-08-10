const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const TOKEN_EXPIRY = '24h';
const ALLOWED_USERNAME = 'Hanfik';

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL = 'https://api.github.com/user';

// ── In-memory state store (CSRF protection) ─────────────────
const pendingStates = new Map();
const STATE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Cleanup expired states every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, ts] of pendingStates) {
    if (now - ts > STATE_TTL_MS) pendingStates.delete(key);
  }
}, 5 * 60 * 1000).unref();

// ── Environment Detection ────────────────────────────────────
function getEnvUrls() {
  const isVercel = !!process.env.VERCEL;
  const port = process.env.PORT || 5001;

  const backendBaseUrl = isVercel
    ? process.env.GITHUB_CALLBACK_URL?.replace(/\/api\/auth\/github\/callback\/?$/, '') || 'https://be-nesaverse.vercel.app'
    : `http://localhost:${port}`;

  const frontendUrl = isVercel
    ? (process.env.FRONTEND_URL || 'https://www.nesaverse.my.id')
    : 'http://localhost:5173';

  return { backendBaseUrl, frontendUrl, isVercel };
}

function getGithubCredentials() {
  const { isVercel } = getEnvUrls();
  if (isVercel) {
    return {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    };
  }
  return {
    clientId: process.env.GITHUB_CLIENT_ID_DEV || process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET_DEV || process.env.GITHUB_CLIENT_SECRET,
  };
}

// ── Generate GitHub OAuth URL ────────────────────────────────
const getGitHubAuthURL = (req, res) => {
  try {
    const state = crypto.randomUUID();
    pendingStates.set(state, Date.now());

    const { backendBaseUrl } = getEnvUrls();
    const { clientId } = getGithubCredentials();
    const redirectUri = `${backendBaseUrl}/api/auth/github/callback`;

    const params = new URLSearchParams({
      client_id: clientId,
      scope: 'read:user',
      state,
      redirect_uri: redirectUri,
    });

    const url = `${GITHUB_AUTHORIZE_URL}?${params.toString()}`;
    res.json({ url });
  } catch (err) {
    console.error('GitHub auth URL error:', err.message);
    res.status(500).json({ message: 'Gagal membuat URL autentikasi' });
  }
};

// ── Handle GitHub OAuth Callback ─────────────────────────────
const handleGitHubCallback = async (req, res) => {
  const { code, state } = req.query;
  const { frontendUrl } = getEnvUrls();

  // 1. Validate state (CSRF protection)
  if (!state || !pendingStates.has(state)) {
    return res.redirect(`${frontendUrl}/admin/login?error=invalid_state`);
  }
  pendingStates.delete(state);

  if (!code) {
    return res.redirect(`${frontendUrl}/admin/login?error=no_code`);
  }

  try {
    // 2. Exchange code for access token
    const { clientId, clientSecret } = getGithubCredentials();
    const tokenRes = await fetch(GITHUB_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      console.error('GitHub token exchange error:', tokenData.error_description);
      return res.redirect(`${frontendUrl}/admin/login?error=token_exchange_failed`);
    }

    const accessToken = tokenData.access_token;
    if (!accessToken) {
      return res.redirect(`${frontendUrl}/admin/login?error=no_access_token`);
    }

    // 3. Fetch GitHub user info
    const userRes = await fetch(GITHUB_USER_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    const userData = await userRes.json();

    if (!userData.login) {
      return res.redirect(`${frontendUrl}/admin/login?error=user_fetch_failed`);
    }

    // 4. Check whitelist — only allowed username
    if (userData.login !== ALLOWED_USERNAME) {
      console.log(`⚠️  Unauthorized login attempt: ${userData.login} (${userData.id})`);
      return res.redirect(`${frontendUrl}/admin/login?error=unauthorized`);
    }

    // 5. Sign JWT
    const token = jwt.sign(
      {
        username: userData.login,
        github_id: userData.id,
        avatar_url: userData.avatar_url,
      },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    // 6. Redirect to frontend with token
    res.redirect(`${frontendUrl}/admin/login?token=${token}`);
  } catch (err) {
    console.error('GitHub callback error:', err.message);
    return res.redirect(`${frontendUrl}/admin/login?error=server_error`);
  }
};

module.exports = { getGitHubAuthURL, handleGitHubCallback };
