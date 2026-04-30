-- Exora Galileo initial schema

CREATE TABLE IF NOT EXISTS guilds (
  id BIGSERIAL PRIMARY KEY,
  discord_guild_id VARCHAR(32) NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  discord_user_id VARCHAR(32) NOT NULL UNIQUE,
  username TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bot_instances (
  id BIGSERIAL PRIMARY KEY,
  bot_name VARCHAR(32) NOT NULL,
  language VARCHAR(32) NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'starting',
  last_heartbeat_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_bot_instances_name UNIQUE (bot_name)
);

CREATE TABLE IF NOT EXISTS command_logs (
  id BIGSERIAL PRIMARY KEY,
  guild_id BIGINT REFERENCES guilds(id) ON DELETE SET NULL,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  bot_name VARCHAR(32) NOT NULL,
  command_name VARCHAR(64) NOT NULL,
  status VARCHAR(16) NOT NULL,
  latency_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_command_logs_created_at ON command_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_command_logs_bot_name ON command_logs(bot_name);
