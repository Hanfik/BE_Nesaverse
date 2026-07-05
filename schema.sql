-- ============================================================
--  NesaVerse Database Schema
--  Database: Neon PostgreSQL (Serverless)
--  Cara pakai:
--    1. Buka Neon Console → SQL Editor
--    2. Copy-paste seluruh file ini → Run
--    3. Atau upload file ini via psql:
--       psql "postgresql://..." -f schema.sql
-- ============================================================

-- ── Drop tables jika sudah ada (untuk re-seed) ───────────────────────────
DROP TABLE IF EXISTS server_categories CASCADE;
DROP TABLE IF EXISTS servers CASCADE;
DROP TABLE IF EXISTS channels CASCADE;
DROP TABLE IF EXISTS communities CASCADE;
DROP TABLE IF EXISTS stats CASCADE;

-- ============================================================
--  TABLE: stats
--  Data agregat platform (satu baris aktif)
-- ============================================================
CREATE TABLE stats (
  id              SERIAL PRIMARY KEY,
  communities     INTEGER NOT NULL DEFAULT 0,
  members         INTEGER NOT NULL DEFAULT 0,
  accounts        INTEGER NOT NULL DEFAULT 0,
  servers         INTEGER NOT NULL DEFAULT 0,
  total_visitors  BIGINT  NOT NULL DEFAULT 0,
  nesa_velocity   INTEGER NOT NULL DEFAULT 0,
  viral_index     NUMERIC(4,1) NOT NULL DEFAULT 0.0,
  system_status   VARCHAR(20) NOT NULL DEFAULT 'online',
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
--  TABLE: communities
--  Komunitas yang ditampilkan di Admin Dashboard
-- ============================================================
CREATE TABLE communities (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  initial       CHAR(1)      NOT NULL,
  color         VARCHAR(20)  NOT NULL DEFAULT 'primary',
  members       VARCHAR(20)  NOT NULL,
  growth        VARCHAR(20)  NOT NULL,
  safety_score  INTEGER      NOT NULL DEFAULT 100 CHECK (safety_score BETWEEN 0 AND 100),
  status        VARCHAR(20)  NOT NULL DEFAULT 'active',
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
--  TABLE: channels
--  WhatsApp channels yang ditampilkan di WhatsApp Hub
-- ============================================================
CREATE TABLE channels (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  category    VARCHAR(50)  NOT NULL,
  followers   INTEGER      NOT NULL DEFAULT 0,
  description TEXT,
  avatar      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
--  TABLE: servers
--  Discord servers yang ditampilkan di Discord Hub
-- ============================================================
CREATE TABLE servers (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  description TEXT,
  members     INTEGER      NOT NULL DEFAULT 0,
  online      INTEGER      NOT NULL DEFAULT 0,
  verified    BOOLEAN      NOT NULL DEFAULT FALSE,
  featured    BOOLEAN      NOT NULL DEFAULT FALSE,
  banner      TEXT,
  icon        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
--  TABLE: server_categories
--  Many-to-many: server ↔ categories (array di JSON → relational)
-- ============================================================
CREATE TABLE server_categories (
  server_id   INTEGER NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  category    VARCHAR(50) NOT NULL,
  PRIMARY KEY (server_id, category)
);

-- ============================================================
--  INDEXES
-- ============================================================
CREATE INDEX idx_channels_category  ON channels (category);
CREATE INDEX idx_servers_verified   ON servers (verified);
CREATE INDEX idx_servers_featured   ON servers (featured);
CREATE INDEX idx_server_cat_cat     ON server_categories (category);

-- ============================================================
--  SEED DATA: stats
-- ============================================================
INSERT INTO stats (communities, members, accounts, servers, total_visitors, nesa_velocity, viral_index, system_status)
VALUES (500, 50000, 2000, 100, 4892103, 842, 9.2, 'online');

-- ============================================================
--  SEED DATA: communities
-- ============================================================
INSERT INTO communities (name, initial, color, members, growth, safety_score, status) VALUES
  ('Nesa_Nexus',    'N', 'primary',   '2.4M', '+8.2%',  92, 'active'),
  ('Creative_Core', 'C', 'secondary', '892K', '+15.7%', 98, 'active'),
  ('PixelArmy',     'P', 'tertiary',  '1.1M', '+5.3%',  85, 'active'),
  ('TechWave',      'T', 'primary',   '340K', '+22.1%', 95, 'active');

-- ============================================================
--  SEED DATA: channels (WhatsApp)
-- ============================================================
INSERT INTO channels (name, category, followers, description, avatar) VALUES
  (
    'Pixel Overlords', 'Gaming', 142000,
    'Daily high-res gaming leaks, mod showcases, and community tournaments for the elite.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA7794zP3LxnzibgoELxTVgiA8ye7a_--q0Cfn840pVWkuDthxfBsBv87HfQCcGUOj05iEK05vONWbegm3zCSVRDIuVI_boBJgW1OY4-z9ucsss6iYQndySSYa3JRyu-PqiRjyAtTm9FZtg7kZVhS2BDzuBOjxyAZLVxtT9bIruDYuT-4erk2xlcDiNZfiu_vOBZotj9Ogu4cqM5f0AbJF9rTUKXNJwfISW2jqAueQ4H-dEwMoe63rRanmPgJkWqJbw1iRtxQTfamE'
  ),
  (
    'Void Reflections', 'DankMemes', 890000,
    'The deepest level of irony and surreal humor. Fresh memes delivered directly from the future.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDrlnbz-b0gQ4DleSnDUVrsL9MR3wzl5PEsiYQJ-SHNEyzengvYHXITHPpL94xDAbfyk5bbIo1Avvs8Dgf5bjSk2JKFr0XSYlZ28-mPaqlnOC8bAdHpYOSEe3QbpUn_UKVDtvDngvxccJ1V2cT0_DqydBZBmgGKjyZr_zsHtXenyQbo9HZdLbWi2-ldrdFpJlnYhTnAVhqk32ob8Jg9fXDGY81BLvxsgngm3q5jI7aYQJTUkAROS7xvbn-sibtqTK5nxqWtIv-3C7U'
  ),
  (
    'CineWave Hub', 'Entertainment', 56000,
    'Exclusive movie trailers, indie short films, and critical reviews for the true cinema lover.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDatlPEgjrnwdjZ0LbPHGUghSNnTfqiHk595kVhmr2QiCwkFCL8-4MAn8n-MqyRi1eWAH2wT_CIdXQVqPjRNQaIDbl9PF-JezuIM4wrycm-5TySrargpa4bT6VApZFBGStgJmohjVOKkMbZeCBRWQq2lrdznOzEPRBz_xHItzgIv9GKX0kVdmHZYcvIuuPd74QoDnaKJFncjXNo7gmbastdkToHzA0vnR5qM2JJZnHZOH1pkI1s2ILsYrbqEQYYu_Y2H6oUuiZmVA0'
  ),
  (
    'Neural Gallery', 'AI-Art', 212000,
    'Curated AI-generated masterpieces and prompt engineering workshops for the digital artisan.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBqG9YSs-k1E9p87VU_BOj3fHciSQCH9xAg_8w_rqhRl29LVienr6aLnHd5awzrZBLtYhJ7Wdzhs_Av1YpdtOISAZRuD0jJ7RZedfeDLpDg_ZHFeg2yRA163b-LLgqUpikCRTRIzjokho0XqYbq0ejwEvhE0nPxMJpqE0Dum-m6AX_9zIcUz7nNrbWHee2i8fz-gTRl0IwGbeetZ77c4HNp9Jc2z2luM9cmALy9E9YfQJS29XU-0tgTkUs5ZoSG70m6cm5mVoNrfQ0'
  ),
  (
    'The Debugger', 'Tech', 78000,
    'The latest in coding hardware, software vulnerabilities, and silicon valley gossip.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC1Xf4aYkKS1ElqVrdWu0CLd_xeIgug1dgWiS2DjSZep0opfSnCdK6SZfnPdjetwqFctSFq53g_4d8zF3k2Sjlc88-lz90hjLdDg2t6qBhAH0hghfPEKScsl80Ub0qGf8mKojYr3y6ZfRjk50DWQfPvw5a4MLvHsafir-DhfVPr27Mo2ltOnpQU4AMsShZznkkJvuI2LYMYGxSBCmgXLXWKt0Bwycn6HMRZxtR0wtCwLTgxJu7WNua9dz35gzaMliboLAxbmPVGg-w'
  ),
  (
    'Apex Circle', 'Elite', 305000,
    'Lifestyle optimization, network growth strategies, and high-performance community chats.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAznwUSUrbB-j6RZlLd0mcqzHUij_wt_53ImSdokLT471E315Gj7b654LXAjTeSEAFfcJ7daQGPPq4IwAO0NfiAzFAzwdLvykyjGv8-5cOQswfJiwUxjLxytZC9LrX_XXS0mLjXbkz9YzUNVN4on6SspaG0K0Dazyjghq3oIya7rcQlm-05B5qmTV4Sgb6UaMwrJsHmG8Y67x6XlVNzC9jH4hers7oH7YKqUM9BwX5o57cwChtzliAvSrhxgkEY_Z_KyWR-6Tm-F4o'
  );

-- ============================================================
--  SEED DATA: servers (Discord)
-- ============================================================
INSERT INTO servers (name, description, members, online, verified, featured, banner, icon) VALUES
  (
    'Pixel Raiders Elite',
    'The premier hub for indie game discovery and speedrun competitions.',
    45829, 1200, TRUE, FALSE,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB2tTeKh5jxP2Zfn0lUzEw1j7BBgDUReo0usj0t3uQ7-cDduCyb4bXygwQVhHBayOW2h2PmwdUMPsdzKDUPFtY9nMZC8BYWX2KM_yElv8n2Kvpw1OG0gpBJYaw6wvnKW14KSGOzGHu7CHTgsoth1VfJOfwV7z7tmqCCIlc2StPdzwg-zuWe6a5l_Ej07Pqo_NWlsLEr61yIY_2YdYtK6NmUsidrxmWlchuIKJ1PLJXYP8vNkXhBMwWKdcJtsruMEZvdPSosGTmNADM',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBpeKreiLsYfCvvenfOr48E4vwsjDgtAjh84I73Zjt7N2ZQLxB9XRPwKuIrjVDOFzOx_pPHLEe7f0lIfmGcBP89UMjoDClaiz4IhctxWHIX5AvbGkhJ0ug0PInl2QzbqRVtLpuLOZzzscZ-_qgK0cEMXVPDBNHftt3Yt1vPynj5pWHmGez1_PKdrOeX6nrP-nPGHWRG8oKJKltobiN0O1Mfw4NjvqLgITwoioyDog4W1zhzUBpmBTVgfRkIW1eTLRUoDLbEhKbhgbY'
  ),
  (
    'Nesa Forge AI',
    'Pushing the boundaries of digital culture using generative AI and neural networks.',
    12104, 2000, FALSE, FALSE,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAVHKmJbxVoAgPu-ifL_YnaB7iei6hAdvQnuJB0BNxekwxRU77LPVIdHBov3xBz_RipoqzdcJTIHyHUSbbbtnUX7rsM9b8mPg5Mm9qVsl6aXAXwD9JSgmg3Z7WKzeuiLSe8uEx30ORD6TVWgDdRsk_0FjV8HrpR_IiKgDZoecUdtJB6olfuGoGb3olw4WPG4q_q360vAsfDq9TxBM0f4KrdCEqTHztjSCktjbWs9NwZbPOt5rPNnZLOluqZAVcMZ3stRknD4Y-4wOk',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBw_Kda9hGbK5CeJHGhbAmtKEGyB_9ZwVp1MO3Bs_Ak10E3Tm_GTbl-W9IM55w7eofURvXoDcNvSXwb-ully_wLMuOhfOxbgeZe_yAT853yTvTa_sA27hlFM4DAWusYdQD1U3Q5bBzTC0Ti-wE84TS7A8RoCG3qIuSZAoXIR3vGCYLaeTlvI1sBTMuo2bcXsBopwXdBZ4w3DxgCg1HkLWi34LrHM8m1TmQnvRgs6Qw-GD1c-mCnrcdbZhhAW-v_t71MLAA8FvqlDN4'
  ),
  (
    'Nesa Legends Clan',
    'The ultimate developmental collective. Trade, build, and conquer together.',
    88293, 4500, TRUE, FALSE,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAcyXoOqOsveb2jMfQlRhkXm1u3uyxOCZ07SZzCO7Mns5zdNeNyweEBwbCcyPv74xKjrONJAt22YRDoDWf9evhKPxEMWM0hgFO6R6aXPUkOtDvO2jID1YKPMvIRs-TwMn8TrbXuqPrurKaM5PwmNgVo2yOvF8WQBUY8VqVXWitl1s1xx5rpZYRQB8mR1XClujIto-x3zTSRhouVaAthCEovOo_aRhJKblwRyql5HqqaiksTPkGntpRuUUakvTHVVhYnIIuZGxLf5m8',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDwYOSM2qj-6ryPCNhCSWBSuLc3L02teqnMpi7NQJYFdSLj35MPgtz7sYA8DVlnJjJWMmoGkrl35VcEGQwO1Cuvm_OKwHTTRGxCDnK5YhsgOK10SJzmWf8JQ93P44L6pf3lYjm7y-0-94E6o9by8_9VUuocFKIXr5psf0r4TJqo1buKqE750XMCB1Q8w6xmaDLT8I_lq2jHIQh36zcoZrPtYsje2lwDytF_tVh-bJ5k7wSsDv5g-essiFbY-7kEV_xIxI8d5Xm8Cck'
  ),
  (
    'The Nesa Architect Syndicate',
    'The flagship community for high-tier creation and digital strategy. Join thousands of creators in daily challenges.',
    124000, 12400, TRUE, TRUE,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAgGT94TqyTeeSisd_hz85gre5YLRrfphiTSQCaccbj19Dy3buVr4XeM8OTpw6F8Ml1n8NNlfYK18uhvONIPJFGY_yWy_dvZ6SaU0a17mY0wTNncJJsWj38L8rLcRmtYGSjl605dNAZ5Ez9OsM4zwn1WnDNsJj39Y_jH_4FALEaVe8OdEc91DuOIUAAa5ScagneGsYepqQn5nVEH-PVqXNqbIscuS_DiA8L5RTQonxQBtKJ753lU8gaGdT00xMdCrX8k0eBa3bW_H4',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAgGT94TqyTeeSisd_hz85gre5YLRrfphiTSQCaccbj19Dy3buVr4XeM8OTpw6F8Ml1n8NNlfYK18uhvONIPJFGY_yWy_dvZ6SaU0a17mY0wTNncJJsWj38L8rLcRmtYGSjl605dNAZ5Ez9OsM4zwn1WnDNsJj39Y_jH_4FALEaVe8OdEc91DuOIUAAa5ScagneGsYepqQn5nVEH-PVqXNqbIscuS_DiA8L5RTQonxQBtKJ753lU8gaGdT00xMdCrX8k0eBa3bW_H4'
  ),
  (
    'CryptoVault DAO',
    'Decentralized finance meets the NesaVerse. Alpha calls, DeFi guides, and on-chain gaming.',
    31200, 890, FALSE, FALSE,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB2tTeKh5jxP2Zfn0lUzEw1j7BBgDUReo0usj0t3uQ7-cDduCyb4bXygwQVhHBayOW2h2PmwdUMPsdzKDUPFtY9nMZC8BYWX2KM_yElv8n2Kvpw1OG0gpBJYaw6wvnKW14KSGOzGHu7CHTgsoth1VfJOfwV7z7tmqCCIlc2StPdzwg-zuWe6a5l_Ej07Pqo_NWlsLEr61yIY_2YdYtK6NmUsidrxmWlchuIKJ1PLJXYP8vNkXhBMwWKdcJtsruMEZvdPSosGTmNADM',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBpeKreiLsYfCvvenfOr48E4vwsjDgtAjh84I73Zjt7N2ZQLxB9XRPwKuIrjVDOFzOx_pPHLEe7f0lIfmGcBP89UMjoDClaiz4IhctxWHIX5AvbGkhJ0ug0PInl2QzbqRVtLpuLOZzzscZ-_qgK0cEMXVPDBNHftt3Yt1vPynj5pWHmGez1_PKdrOeX6nrP-nPGHWRG8oKJKltobiN0O1Mfw4NjvqLgITwoioyDog4W1zhzUBpmBTVgfRkIW1eTLRUoDLbEhKbhgbY'
  ),
  (
    'Art & Design Nexus',
    'Portfolio sharing, design challenges, and creative workshops for digital artists.',
    67500, 2100, TRUE, FALSE,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAVHKmJbxVoAgPu-ifL_YnaB7iei6hAdvQnuJB0BNxekwxRU77LPVIdHBov3xBz_RipoqzdcJTIHyHUSbbbtnUX7rsM9b8mPg5Mm9qVsl6aXAXwD9JSgmg3Z7WKzeuiLSe8uEx30ORD6TVWgDdRsk_0FjV8HrpR_IiKgDZoecUdtJB6olfuGoGb3olw4WPG4q_q360vAsfDq9TxBM0f4KrdCEqTHztjSCktjbWs9NwZbPOt5rPNnZLOluqZAVcMZ3stRknD4Y-4wOk',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBw_Kda9hGbK5CeJHGhbAmtKEGyB_9ZwVp1MO3Bs_Ak10E3Tm_GTbl-W9IM55w7eofURvXoDcNvSXwb-ully_wLMuOhfOxbgeZe_yAT853yTvTa_sA27hlFM4DAWusYdQD1U3Q5bBzTC0Ti-wE84TS7A8RoCG3qIuSZAoXIR3vGCYLaeTlvI1sBTMuo2bcXsBopwXdBZ4w3DxgCg1HkLWi34LrHM8m1TmQnvRgs6Qw-GD1c-mCnrcdbZhhAW-v_t71MLAA8FvqlDN4'
  );

-- ============================================================
--  SEED DATA: server_categories
-- ============================================================
INSERT INTO server_categories (server_id, category) VALUES
  (1, 'Gaming'), (1, 'Events'),
  (2, 'Tech'),   (2, 'Innovation'),
  (3, 'Social'), (3, 'Building'),
  (4, 'Creators'), (4, 'Strategy'), (4, 'Elite'),
  (5, 'Crypto'), (5, 'Finance'),
  (6, 'Art & Design'), (6, 'Education');

-- ============================================================
--  VERIFICATION — jalankan ini untuk memastikan data masuk
-- ============================================================
-- SELECT 'stats'       AS tabel, COUNT(*) FROM stats       UNION ALL
-- SELECT 'communities' AS tabel, COUNT(*) FROM communities UNION ALL
-- SELECT 'channels'    AS tabel, COUNT(*) FROM channels    UNION ALL
-- SELECT 'servers'     AS tabel, COUNT(*) FROM servers     UNION ALL
-- SELECT 'srv_cats'    AS tabel, COUNT(*) FROM server_categories;
