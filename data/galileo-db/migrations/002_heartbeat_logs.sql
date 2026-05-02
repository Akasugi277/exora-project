-- Heartbeat history log
-- Records every heartbeat tick per bot for graph / uptime analysis.

CREATE TABLE IF NOT EXISTS heartbeat_logs (
  id         BIGSERIAL PRIMARY KEY,
  bot_name   VARCHAR(32) NOT NULL,
  logged_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_heartbeat_logs_bot_logged
  ON heartbeat_logs (bot_name, logged_at DESC);
