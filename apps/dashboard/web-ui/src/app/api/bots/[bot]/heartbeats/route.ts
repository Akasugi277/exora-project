import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export interface HeartbeatEntry {
  logged_at: string;
}

/**
 * GET /api/bots/[bot]/heartbeats?minutes=10
 * Returns heartbeat timestamps for the given bot over the last N minutes.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ bot: string }> },
) {
  const { bot } = await params;
  const url = new URL(_req.url);
  const minutes = Math.min(60, Math.max(1, parseInt(url.searchParams.get('minutes') ?? '10', 10)));

  try {
    const { rows } = await pool.query<HeartbeatEntry>(
      `SELECT logged_at
       FROM heartbeat_logs
       WHERE bot_name = $1
         AND logged_at >= NOW() - ($2 || ' minutes')::INTERVAL
       ORDER BY logged_at ASC`,
      [bot, minutes],
    );
    return NextResponse.json({ bot, minutes, heartbeats: rows });
  } catch (err) {
    console.error('[dashboard] heartbeat query failed:', err);
    return NextResponse.json({ error: 'Failed to fetch heartbeats' }, { status: 500 });
  }
}
