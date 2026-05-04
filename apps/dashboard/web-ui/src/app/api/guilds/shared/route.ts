import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { BOT_KEYS, type BotKey } from '@/lib/bot-meta';

interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
}

type BotGuildStatus = 'ok' | 'error';

interface SharedGuildsResponse {
  bots: Record<BotKey, { status: BotGuildStatus; guilds: DiscordGuild[] }>;
}

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

export async function GET() {
  const user = await getSessionUser();
  if (!user || !user.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let userGuilds: DiscordGuild[];
  try {
    userGuilds = await fetchAllGuilds(`Bearer ${user.accessToken}`);
  } catch (err) {
    if (err instanceof DiscordApiError && (err.status === 401 || err.status === 403)) {
      return NextResponse.json(
        { error: 'missing_scope', message: 'guilds scope not granted. Please re-login.' },
        { status: 403 },
      );
    }
    console.error('[shared-guilds] failed to fetch user guilds:', err);
    return NextResponse.json(
      { error: 'internal_error', message: 'Failed to fetch user guilds' },
      { status: 500 },
    );
  }

  const userGuildMap = new Map(userGuilds.map((g) => [g.id, g]));

  const results = await Promise.all(
    BOT_KEYS.map(async (bot) => {
      const tokenEnv = BOT_TOKEN_ENV[bot];
      const token = process.env[tokenEnv];
      if (!token) {
        return [bot, { status: 'error', guilds: [] }] as const;
      }

      try {
        const botGuilds = await fetchAllGuilds(`Bot ${token}`);
        const shared = botGuilds
          .filter((guild) => userGuildMap.has(guild.id))
          .map((guild) => userGuildMap.get(guild.id)!)
          .sort((a, b) => a.name.localeCompare(b.name, 'ja'));

        return [bot, { status: 'ok', guilds: shared }] as const;
      } catch (err) {
        console.error(`[shared-guilds] failed for ${bot}:`, err);
        return [bot, { status: 'error', guilds: [] }] as const;
      }
    }),
  );

  const bots = Object.fromEntries(results) as SharedGuildsResponse['bots'];
  return NextResponse.json({ bots } satisfies SharedGuildsResponse);
}
