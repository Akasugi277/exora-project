import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export interface BotStatus {
  bot_name: string;
  language: string;
  status: string;
  last_heartbeat_at: string | null;
}

export async function GET() {
  try {
    const { rows } = await pool.query<BotStatus>(
      `SELECT bot_name, language, status, last_heartbeat_at
       FROM bot_instances
       ORDER BY bot_name`,
    );
    return NextResponse.json({ bots: rows });
  } catch (err) {
    console.error('[dashboard] DB query failed:', err);
    return NextResponse.json(
      { error: 'Failed to fetch bot status' },
      { status: 500 },
    );
  }
}
