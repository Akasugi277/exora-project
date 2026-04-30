import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export interface CommandLogEntry {
  botName: string;
  guildId: string | null;
  userId: string | null;
  commandName: string;
  status: 'ok' | 'error';
  latencyMs?: number;
}

export async function logCommand(entry: CommandLogEntry): Promise<void> {
  const { botName, guildId, userId, commandName, status, latencyMs } = entry;
  await pool.query(
    `INSERT INTO command_logs (bot_name, command_name, status, latency_ms, created_at)
     VALUES ($1, $2, $3, $4, NOW())`,
    [botName, commandName, status, latencyMs ?? null],
  );
  // guild and user upserts are best-effort; ignore errors
  try {
    if (guildId) {
      await pool.query(
        `INSERT INTO guilds (discord_guild_id, name) VALUES ($1, $1)
         ON CONFLICT (discord_guild_id) DO NOTHING`,
        [guildId],
      );
    }
    if (userId) {
      await pool.query(
        `INSERT INTO users (discord_user_id, username) VALUES ($1, $1)
         ON CONFLICT (discord_user_id) DO NOTHING`,
        [userId],
      );
    }
  } catch {
    // non-critical
  }
}

export async function upsertBotInstance(
  botName: string,
  language: string,
): Promise<void> {
  await pool.query(
    `INSERT INTO bot_instances (bot_name, language, status, last_heartbeat_at)
     VALUES ($1, $2, 'online', NOW())
     ON CONFLICT (bot_name) DO UPDATE
       SET status = 'online', last_heartbeat_at = NOW()`,
    [botName, language],
  );
}

/** Sends a heartbeat UPDATE every `intervalMs` ms (default 30 s). */
export function startHeartbeat(botName: string, intervalMs = 30_000): void {
  setInterval(() => {
    pool
      .query(
        `UPDATE bot_instances SET last_heartbeat_at = NOW() WHERE bot_name = $1`,
        [botName],
      )
      .catch((e: unknown) => console.warn(`[${botName}] heartbeat failed:`, e));
  }, intervalMs).unref(); // unref so the timer doesn't prevent clean shutdown
}

export { pool };
