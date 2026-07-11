-- ============================================================
--  NesaVerse Schema v3 — Patch: updated_at columns
--  Jalankan SETELAH schema_v2.sql sudah di-import
-- ============================================================

-- Tambahkan updated_at ke servers dan channels jika belum ada
ALTER TABLE servers  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE channels ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Tambahkan updated_at ke platform tables
ALTER TABLE instagram_accounts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE tiktok_accounts     ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE youtube_channels    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE roblox_games        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Stats table seed jika belum ada data
INSERT INTO stats (communities, members, accounts, servers, total_visitors, nesa_velocity, viral_index, system_status)
SELECT 500, 1200000, 150, 45, 250000, 1800, 9.2, 'Optimal'
WHERE NOT EXISTS (SELECT 1 FROM stats LIMIT 1);
