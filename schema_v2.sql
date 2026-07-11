-- ============================================================
--  NesaVerse Schema v2 — Tabel Baru
--  Jalankan SETELAH schema.sql sudah di-import
-- ============================================================

-- ── Drop jika sudah ada ──────────────────────────────────────
DROP TABLE IF EXISTS roblox_games CASCADE;
DROP TABLE IF EXISTS youtube_channels CASCADE;
DROP TABLE IF EXISTS tiktok_accounts CASCADE;
DROP TABLE IF EXISTS instagram_accounts CASCADE;
DROP TABLE IF EXISTS donations CASCADE;

-- ── Tambahkan kolom link & status ke tabel lama ──────────────
ALTER TABLE servers  ADD COLUMN IF NOT EXISTS link TEXT;
ALTER TABLE servers  ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'active';
ALTER TABLE channels ADD COLUMN IF NOT EXISTS link TEXT;
ALTER TABLE channels ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'active';

-- ============================================================
--  TABLE: instagram_accounts
-- ============================================================
CREATE TABLE instagram_accounts (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(150) NOT NULL,
  handle     VARCHAR(100) NOT NULL,
  avatar     TEXT,
  followers  VARCHAR(20)  NOT NULL DEFAULT '0',
  posts      INTEGER      NOT NULL DEFAULT 0,
  category   VARCHAR(50)  NOT NULL,
  bio        TEXT,
  verified   BOOLEAN      NOT NULL DEFAULT FALSE,
  link       TEXT,
  gradient   TEXT         NOT NULL DEFAULT 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
  status     VARCHAR(20)  NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
--  TABLE: tiktok_accounts
-- ============================================================
CREATE TABLE tiktok_accounts (
  id         SERIAL PRIMARY KEY,
  creator    VARCHAR(100) NOT NULL,
  title      VARCHAR(200) NOT NULL,
  views      VARCHAR(20)  NOT NULL DEFAULT '0',
  likes      VARCHAR(20)  NOT NULL DEFAULT '0',
  category   VARCHAR(50)  NOT NULL,
  thumb      TEXT,
  avatar     TEXT,
  trending   BOOLEAN      NOT NULL DEFAULT FALSE,
  duration   VARCHAR(10),
  link       TEXT,
  status     VARCHAR(20)  NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
--  TABLE: youtube_channels
-- ============================================================
CREATE TABLE youtube_channels (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  thumbnail   TEXT,
  subscribers VARCHAR(20)  NOT NULL DEFAULT '0',
  description TEXT,
  link        TEXT         NOT NULL,
  category    VARCHAR(50)  NOT NULL,
  status      VARCHAR(20)  NOT NULL DEFAULT 'active',
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
--  TABLE: roblox_games
-- ============================================================
CREATE TABLE roblox_games (
  id               SERIAL PRIMARY KEY,
  name             VARCHAR(150) NOT NULL,
  thumbnail        TEXT,
  description      TEXT,
  link_game        TEXT         NOT NULL,
  link_community   TEXT,
  status           VARCHAR(20)  NOT NULL DEFAULT 'active',
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
--  TABLE: donations
-- ============================================================
CREATE TABLE donations (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(150) NOT NULL DEFAULT 'Anonymous',
  is_anonymous BOOLEAN      NOT NULL DEFAULT FALSE,
  amount       INTEGER      NOT NULL,
  message      TEXT,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
--  INDEXES
-- ============================================================
CREATE INDEX idx_ig_category     ON instagram_accounts (category);
CREATE INDEX idx_tt_category     ON tiktok_accounts (category);
CREATE INDEX idx_yt_category     ON youtube_channels (category);
CREATE INDEX idx_donations_time  ON donations (created_at DESC);

-- ============================================================
--  SEED: instagram_accounts
-- ============================================================
INSERT INTO instagram_accounts (name, handle, avatar, followers, posts, category, bio, verified, link, gradient) VALUES
('NesaVerse Official','@NesaVerse_Official','https://lh3.googleusercontent.com/aida-public/AB6AXuDCfpnQHAauZhNMkVxEucI8YnYxpjYo41F5UHzzjOf9CINKrpLfO8aVOgcp-Vl0en4pwOe13EAFyH7UjnB8dLoMIaRIE4G6IceUnBFnMl__UsZwTtxgcUf7EZt2CenFHcDOodrCi3WTd2bUgyjT3r8B978onqzc4yM1WdALFFVxg5qeN0PLCOc0jFQ5onhsZupbwCGbF-KzPQVPrROcP1pMM9R-xkmN55uSdMAB4VR4SnF2-k-R3QlbIUexASwLVIGA-zsjsVEBtZU','2.4M',1280,'Gaming','Official channel NesaVerse. Game drops, collabs & viral reels.',TRUE,'https://instagram.com/nesaverse','linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)'),
('PixelArtz Hub','@PixelArtz_Hub','https://lh3.googleusercontent.com/aida-public/AB6AXuAdouzG8-pPr-YVAZRIl03eMGHVYseAGOgRknQlsS4Zd74B5skaTMcKYxz56_JhbJuyUVDwavJMcaSTEDWKue3yQgZbxQaa3o3K9--RMz9AkibhERP1fkCRbZ5HQq1EMzBJmyx2ZguQCrU0NH_tK-8JTXleA-VBdG_BJ1O3ord55FNkUpZZnbdzujEW8J1EEcvG-FOueC60ZUHBKWQS2cbvS4brK3VhNbzLlv7jNj_ZiHXXcXrOjM5GhohrdtueL_iDXnNAfszPwLE','890K',3400,'AI-Art','Daily AI-generated pixel art & prompt engineering.',TRUE,'https://instagram.com/pixelartzh','linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)'),
('NeonClan Indonesia','@NeonClan_ID','https://lh3.googleusercontent.com/aida-public/AB6AXuDP6mxX2zHysneidishNSMPiRzelXkebcI6egAsW9lTNa3A13vYYJWh9GegRRvP_do4KGqsQpidg7PrI3fMcBubT94SWKWKmXSzSgG-Yf8F4EI7k8Ly4CDJYFF6V_aznrCriWqSvEagWJYGR0RM6l6BN-ZQD9Z7KAHNpmH_OpxOMoVtEl-Ej1p4NQOnKEZjMWFhFWjjVKD3sjVY16-HIicW5QMvLcwKdAGsJ4JiRRKdDI3FqRixYQzwDt1AFBVvzYUWBtXQn9YxDYU','1.1M',782,'Gaming','Top gaming clan Indonesia. Tourneys, highlights & behind the scenes.',FALSE,'https://instagram.com/neonclan_id','linear-gradient(135deg,#405de6,#5851db,#833ab4)'),
('Creative Core Studio','@CreativeCore_','https://lh3.googleusercontent.com/aida-public/AB6AXuCeWix45HGRnvtB12X3_J-XTZInVaKph2TK9NnYZcRDMLf3a-uJAEvxclTW2IDGMSoBkJjgEN9lfLoyz_lIdWIAzLlAeqRCZyC4mBVPNsjcMTyI6KMx8cabb3l_tFQtX75JIf65SkdvHXZAwWEHmhtaqEPh_bqDETvamQLLChngzJZBn-2KQIa7_MdDW81ABka9cj-9sLifO5qQA4tpdytZsIufeqpmXqCJCNdk8d831NLLYlcXJ0AsgfhlHczIbgn6nPy2b2PF6UQ','560K',2100,'Design','UI/UX design inspiration & tutorials for digital creatives worldwide.',TRUE,'https://instagram.com/creativecore','linear-gradient(135deg,#f09433,#e6683c,#dc2743)'),
('TechWave Indonesia','@TechWave_ID','https://lh3.googleusercontent.com/aida-public/AB6AXuDRzcBerLapVvk3TzyGqRwLdbnoL5N1PCTC2sdmlwJAmx9F7MnQoM7G8WRi2Gbf1p08Jlnytd-SRfTY556tudmF1Sbk57v9RJWpE-WXcTER-N7HAdUzQVayVyHA6lfdqPMtQduwVcZGMvt0blU5nq2fDg7unVltWQu0zf8B2j9t5_AtXy9iP5ToJjAReG8E1rlMyHiWnAAWppSUAEBceARxRzttnjrAS27lnptYMERHHsgdE6cv4H9bAc2ZOIaHvjE0g_jYj_459ao','320K',940,'Tech','Breaking tech news, gadget reviews & AI research simplified daily.',FALSE,'https://instagram.com/techwave_id','linear-gradient(135deg,#12c2e9,#c471ed,#f64f59)'),
('Void Aesthetic','@VoidAesthetic','https://lh3.googleusercontent.com/aida-public/AB6AXuDCfpnQHAauZhNMkVxEucI8YnYxpjYo41F5UHzzjOf9CINKrpLfO8aVOgcp-Vl0en4pwOe13EAFyH7UjnB8dLoMIaRIE4G6IceUnBFnMl__UsZwTtxgcUf7EZt2CenFHcDOodrCi3WTd2bUgyjT3r8B978onqzc4yM1WdALFFVxg5qeN0PLCOc0jFQ5onhsZupbwCGbF-KzPQVPrROcP1pMM9R-xkmN55uSdMAB4VR4SnF2-k-R3QlbIUexASwLVIGA-zsjsVEBtZU','780K',1550,'Lifestyle','Curated dark aesthetic, lo-fi vibes & midnight photography.',TRUE,'https://instagram.com/voidaesthetic','linear-gradient(135deg,#2c3e50,#4ca1af)');

-- ============================================================
--  SEED: tiktok_accounts
-- ============================================================
INSERT INTO tiktok_accounts (creator, title, views, likes, category, thumb, avatar, trending, duration, link) VALUES
('@Viper.eth','NesaVerse x PixelArmy EPIC Collab 🔥','8.2M','1.1M','Gaming','https://lh3.googleusercontent.com/aida-public/AB6AXuB2tTeKh5jxP2Zfn0lUzEw1j7BBgDUReo0usj0t3uQ7-cDduCyb4bXygwQVhHBayOW2h2PmwdUMPsdzKDUPFtY9nMZC8BYWX2KM_yElv8n2Kvpw1OG0gpBJYaw6wvnKW14KSGOzGHu7CHTgsoth1VfJOfwV7z7tmqCCIlc2StPdzwg-zuWe6a5l_Ej07Pqo_NWlsLEr61yIY_2YdYtK6NmUsidrxmWlchuIKJ1PLJXYP8vNkXhBMwWKdcJtsruMEZvdPSosGTmNADM','https://lh3.googleusercontent.com/aida-public/AB6AXuDCfpnQHAauZhNMkVxEucI8YnYxpjYo41F5UHzzjOf9CINKrpLfO8aVOgcp-Vl0en4pwOe13EAFyH7UjnB8dLoMIaRIE4G6IceUnBFnMl__UsZwTtxgcUf7EZt2CenFHcDOodrCi3WTd2bUgyjT3r8B978onqzc4yM1WdALFFVxg5qeN0PLCOc0jFQ5onhsZupbwCGbF-KzPQVPrROcP1pMM9R-xkmN55uSdMAB4VR4SnF2-k-R3QlbIUexASwLVIGA-zsjsVEBtZU',TRUE,'0:47','https://tiktok.com/@viper.eth'),
('@NeonKat','AI Art Tutorial: Midjourney Masterclass','4.5M','620K','AI-Art','https://lh3.googleusercontent.com/aida-public/AB6AXuDRzcBerLapVvk3TzyGqRwLdbnoL5N1PCTC2sdmlwJAmx9F7MnQoM7G8WRi2Gbf1p08Jlnytd-SRfTY556tudmF1Sbk57v9RJWpE-WXcTER-N7HAdUzQVayVyHA6lfdqPMtQduwVcZGMvt0blU5nq2fDg7unVltWQu0zf8B2j9t5_AtXy9iP5ToJjAReG8E1rlMyHiWnAAWppSUAEBceARxRzttnjrAS27lnptYMERHHsgdE6cv4H9bAc2ZOIaHvjE0g_jYj_459ao','https://lh3.googleusercontent.com/aida-public/AB6AXuAdouzG8-pPr-YVAZRIl03eMGHVYseAGOgRknQlsS4Zd74B5skaTMcKYxz56_JhbJuyUVDwavJMcaSTEDWKue3yQgZbxQaa3o3K9--RMz9AkibhERP1fkCRbZ5HQq1EMzBJmyx2ZguQCrU0NH_tK-8JTXleA-VBdG_BJ1O3ord55FNkUpZZnbdzujEW8J1EEcvG-FOueC60ZUHBKWQS2cbvS4brK3VhNbzLlv7jNj_ZiHXXcXrOjM5GhohrdtueL_iDXnNAfszPwLE',FALSE,'2:15','https://tiktok.com/@neonkat'),
('@DankLord_','Meme Compilation NesaVerse ft. TechWave','12.7M','2.3M','Memes','https://lh3.googleusercontent.com/aida-public/AB6AXuB2tTeKh5jxP2Zfn0lUzEw1j7BBgDUReo0usj0t3uQ7-cDduCyb4bXygwQVhHBayOW2h2PmwdUMPsdzKDUPFtY9nMZC8BYWX2KM_yElv8n2Kvpw1OG0gpBJYaw6wvnKW14KSGOzGHu7CHTgsoth1VfJOfwV7z7tmqCCIlc2StPdzwg-zuWe6a5l_Ej07Pqo_NWlsLEr61yIY_2YdYtK6NmUsidrxmWlchuIKJ1PLJXYP8vNkXhBMwWKdcJtsruMEZvdPSosGTmNADM','https://lh3.googleusercontent.com/aida-public/AB6AXuDP6mxX2zHysneidishNSMPiRzelXkebcI6egAsW9lTNa3A13vYYJWh9GegRRvP_do4KGqsQpidg7PrI3fMcBubT94SWKWKmXSzSgG-Yf8F4EI7k8Ly4CDJYFF6V_aznrCriWqSvEagWJYGR0RM6l6BN-ZQD9Z7KAHNpmH_OpxOMoVtEl-Ej1p4NQOnKEZjMWFhFWjjVKD3sjVY16-HIicW5QMvLcwKdAGsJ4JiRRKdDI3FqRixYQzwDt1AFBVvzYUWBtXQn9YxDYU',TRUE,'1:02','https://tiktok.com/@dank'),
('@TechWave_ID','GPT-5 Review: Game Changer or Hype?','6.1M','890K','Tech','https://lh3.googleusercontent.com/aida-public/AB6AXuDRzcBerLapVvk3TzyGqRwLdbnoL5N1PCTC2sdmlwJAmx9F7MnQoM7G8WRi2Gbf1p08Jlnytd-SRfTY556tudmF1Sbk57v9RJWpE-WXcTER-N7HAdUzQVayVyHA6lfdqPMtQduwVcZGMvt0blU5nq2fDg7unVltWQu0zf8B2j9t5_AtXy9iP5ToJjAReG8E1rlMyHiWnAAWppSUAEBceARxRzttnjrAS27lnptYMERHHsgdE6cv4H9bAc2ZOIaHvjE0g_jYj_459ao','https://lh3.googleusercontent.com/aida-public/AB6AXuCeWix45HGRnvtB12X3_J-XTZInVaKph2TK9NnYZcRDMLf3a-uJAEvxclTW2IDGMSoBkJjgEN9lfLoyz_lIdWIAzLlAeqRCZyC4mBVPNsjcMTyI6KMx8cabb3l_tFQtX75JIf65SkdvHXZAwWEHmhtaqEPh_bqDETvamQLLChngzJZBn-2KQIa7_MdDW81ABka9cj-9sLifO5qQA4tpdytZsIufeqpmXqCJCNdk8d831NLLYlcXJ0AsgfhlHczIbgn6nPy2b2PF6UQ',FALSE,'3:28','https://tiktok.com/@techwaveid');

-- ============================================================
--  SEED: youtube_channels
-- ============================================================
INSERT INTO youtube_channels (name, thumbnail, subscribers, description, link, category) VALUES
('NesaVerse Official','https://lh3.googleusercontent.com/aida-public/AB6AXuB2tTeKh5jxP2Zfn0lUzEw1j7BBgDUReo0usj0t3uQ7-cDduCyb4bXygwQVhHBayOW2h2PmwdUMPsdzKDUPFtY9nMZC8BYWX2KM_yElv8n2Kvpw1OG0gpBJYaw6wvnKW14KSGOzGHu7CHTgsoth1VfJOfwV7z7tmqCCIlc2StPdzwg-zuWe6a5l_Ej07Pqo_NWlsLEr61yIY_2YdYtK6NmUsidrxmWlchuIKJ1PLJXYP8vNkXhBMwWKdcJtsruMEZvdPSosGTmNADM','1.2M','Konten gaming & komunitas NesaVerse. Drop, collab, tournament.','https://youtube.com/@nesaverse','Gaming'),
('PixelArtz Channel','https://lh3.googleusercontent.com/aida-public/AB6AXuDRzcBerLapVvk3TzyGqRwLdbnoL5N1PCTC2sdmlwJAmx9F7MnQoM7G8WRi2Gbf1p08Jlnytd-SRfTY556tudmF1Sbk57v9RJWpE-WXcTER-N7HAdUzQVayVyHA6lfdqPMtQduwVcZGMvt0blU5nq2fDg7unVltWQu0zf8B2j9t5_AtXy9iP5ToJjAReG8E1rlMyHiWnAAWppSUAEBceARxRzttnjrAS27lnptYMERHHsgdE6cv4H9bAc2ZOIaHvjE0g_jYj_459ao','890K','Tutorial AI art, Midjourney, Stable Diffusion & digital painting.','https://youtube.com/@pixelartzch','AI-Art'),
('TechWave Indonesia','https://lh3.googleusercontent.com/aida-public/AB6AXuAVHKmJbxVoAgPu-ifL_YnaB7iei6hAdvQnuJB0BNxekwxRU77LPVIdHBov3xBz_RipoqzdcJTIHyHUSbbbtnUX7rsM9b8mPg5Mm9qVsl6aXAXwD9JSgmg3Z7WKzeuiLSe8uEx30ORD6TVWgDdRsk_0FjV8HrpR_IiKgDZoecUdtJB6olfuGoGb3olw4WPG4q_q360vAsfDq9TxBM0f4KrdCEqTHztjSCktjbWs9NwZbPOt5rPNnZLOluqZAVcMZ3stRknD4Y-4wOk','450K','Review gadget, berita tech terkini & tutorial programming.','https://youtube.com/@techwave_id','Tech');

-- ============================================================
--  SEED: roblox_games
-- ============================================================
INSERT INTO roblox_games (name, thumbnail, description, link_game, link_community) VALUES
('NesaVerse World','https://lh3.googleusercontent.com/aida-public/AB6AXuAcyXoOqOsveb2jMfQlRhkXm1u3uyxOCZ07SZzCO7Mns5zdNeNyweEBwbCcyPv74xKjrONJAt22YRDoDWf9evhKPxEMWM0hgFO6R6aXPUkOtDvO2jID1YKPMvIRs-TwMn8TrbXuqPrurKaM5PwmNgVo2yOvF8WQBUY8VqVXWitl1s1xx5rpZYRQB8mR1XClujIto-x3zTSRhouVaAthCEovOo_aRhJKblwRyql5HqqaiksTPkGntpRuUUakvTHVVhYnIIuZGxLf5m8','Open world RPG dengan komunitas NesaVerse. Build, explore, dan battle bersama!','https://www.roblox.com/games/123','https://discord.gg/nesaverse'),
('Pixel Raiders','https://lh3.googleusercontent.com/aida-public/AB6AXuB2tTeKh5jxP2Zfn0lUzEw1j7BBgDUReo0usj0t3uQ7-cDduCyb4bXygwQVhHBayOW2h2PmwdUMPsdzKDUPFtY9nMZC8BYWX2KM_yElv8n2Kvpw1OG0gpBJYaw6wvnKW14KSGOzGHu7CHTgsoth1VfJOfwV7z7tmqCCIlc2StPdzwg-zuWe6a5l_Ej07Pqo_NWlsLEr61yIY_2YdYtK6NmUsidrxmWlchuIKJ1PLJXYP8vNkXhBMwWKdcJtsruMEZvdPSosGTmNADM','Game battle royale bertemakan pixel art dari komunitas PixelArmy.','https://www.roblox.com/games/456',NULL);

-- ============================================================
--  SEED: donations (contoh awal)
-- ============================================================
INSERT INTO donations (name, is_anonymous, amount, message) VALUES
('Andi Kurniawan',FALSE,50000,'Semangat terus NesaVerse! 🔥'),
('Anonymous',TRUE,100000,NULL),
('Budi Santoso',FALSE,25000,'Mantap, terus berkembang!');
