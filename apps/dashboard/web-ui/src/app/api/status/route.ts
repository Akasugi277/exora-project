import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const OFFLINE_THRESHOLD_SECONDS = 30;

export interface BotStatus {
  bot_name: string;
  language: string;
  status: string;
  last_heartbeat_at: string | null;
}

function isOnlineByHeartbeat(lastHeartbeatAt: string | null, nowMs: number): boolean {
  if (!lastHeartbeatAt) return false;
  const beatMs = new Date(lastHeartbeatAt).getTime();
  if (Number.isNaN(beatMs)) return false;
  const diffSeconds = (nowMs - beatMs) / 1000;
  return diffSeconds <= OFFLINE_THRESHOLD_SECONDS;
}

export async function GET() {
  try {
    const { rows } = await pool.query<BotStatus>(
      `SELECT bot_name, language, status, last_heartbeat_at
       FROM bot_instances
       ORDER BY bot_name`,
    );

    const nowMs = Date.now();
    const bots: BotStatus[] = rows.map((row) => ({
      ...row,
      status: isOnlineByHeartbeat(row.last_heartbeat_at, nowMs) ? 'online' : 'offline',
    }));

    return NextResponse.json({ bots });
  } catch (err) {
    console.error('[dashboard] DB query failed:', err);
    return NextResponse.json(
      { error: 'Failed to fetch bot status' },
      { status: 500 },
    );
  }
}
