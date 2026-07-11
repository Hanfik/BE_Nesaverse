-- ============================================================
--  NesaVerse Schema v4 — page_visits table for visitor tracking
-- ============================================================

CREATE TABLE IF NOT EXISTS page_visits (
  id         BIGSERIAL    PRIMARY KEY,
  visited_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visits_time ON page_visits (visited_at DESC);

-- Ensure stats table has total_visitors column initialised
UPDATE stats
SET total_visitors = COALESCE(total_visitors, 0)
WHERE total_visitors IS NULL;
