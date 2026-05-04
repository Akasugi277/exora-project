import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { isBotKey } from '@/lib/bot-meta';
import type { BotKey } from '@/lib/bot-meta';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
}

export interface GuildsResponse {
  guilds: DiscordGuild[];
}

// ─── Helpers ───────────────────────────────────────────────────────────────

const BOT_TOKEN_ENV: Record<BotKey, string> = {
  jupiter: 'DISCORD_TOKEN_JUPITER',
  saturn: 'DISCORD_TOKEN_SATURN',
  uranus: 'DISCORD_TOKEN_URANUS',
  neptune: 'DISCORD_TOKEN_NEPTUNE',
};

class DiscordApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'DiscordApiError';
  }
}

async function fetchAllGuilds(authorization: string): Promise<DiscordGuild[]> {
  const guilds: DiscordGuild[] = [];
  let after: string | null = null;

  while (true) {
    const url = new URL('https://discord.com/api/v10/users/@me/guilds');
    url.searchParams.set('limit', '200');
    if (after) url.searchParams.set('after', after);

    const res = await fetch(url.toString(), {
      headers: { Authorization: authorization },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      throw new DiscordApiError(
        `Discord API error: ${res.status} ${res.statusText}`,
        res.status,
      );
    }

    const page = (await res.json()) as DiscordGuild[];
    guilds.push(...page);

    if (page.length < 200) break;
    after = page[page.length - 1].id;
  }

  return guilds;
}

// ─── Route ─────────────────────────────────────────────────────────────────

/**
 * GET /api/bots/[bot]/guilds
 * Returns guilds where both the logged-in user and the specified bot are present.
 * Requires: valid session with accessToken (guilds OAuth2 scope).
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ bot: string }> },
) {
  const { bot } = await params;

  if (!isBotKey(bot)) {
    return NextResponse.json({ error: 'Unknown bot' }, { status: 404 });
  }

  const user = await getSessionUser();
  if (!user || !user.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const botTokenKey = BOT_TOKEN_ENV[bot as BotKey];
  const botToken = process.env[botTokenKey];
  if (!botToken) {
    return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 });
  }

  try {
    const [userGuilds, botGuilds] = await Promise.all([
      fetchAllGuilds(`Bearer ${user.accessToken}`),
      fetchAllGuilds(`Bot ${botToken}`),
    ]);

    const botGuildIds = new Set(botGuilds.map((g) => g.id));
    const guilds = userGuilds.filter((g) => botGuildIds.has(g.id));

    return NextResponse.json({ guilds } satisfies GuildsResponse);
  } catch (err) {
    if (err instanceof DiscordApiError) {
      // 401/403 from user token → likely missing guilds scope → re-auth needed
      if (err.status === 401 || err.status === 403) {
        return NextResponse.json(
          { error: 'missing_scope', message: 'guilds scope not granted. Please re-login.' },
          { status: 403 },
        );
      }
      return NextResponse.json(
        { error: 'discord_api_error', message: err.message },
        { status: 502 },
      );
    }
    console.error('[guilds] unexpected error:', err);
    return NextResponse.json(
      { error: 'internal_error', message: 'Failed to fetch guilds' },
      { status: 500 },
    );
  }
}
